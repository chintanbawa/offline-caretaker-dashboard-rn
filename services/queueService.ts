import { deployPackage, sendCommand } from '@/api/deviceApi';
import {
  insertQueuedAction,
  listPendingQueuedActions,
  markQueuedActionFailed,
  markQueuedActionProcessing,
  markQueuedActionSuccess,
  type QueuedActionType,
} from '@/db/repositories/actionsRepo';
import { getSetting } from '@/db/repositories/settingsRepo';
import { writeAudit } from './auditService';

const MAX_RETRIES = 3;

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export async function enqueueAction(input: {
  actionType: QueuedActionType;
  payload: Record<string, unknown>;
}) {
  const id = createId('queue');

  await insertQueuedAction({
    id,
    actionType: input.actionType,
    payloadJson: JSON.stringify(input.payload),
  });

  await writeAudit({
    eventType: 'QUEUE_ADD',
    description: `Queued ${input.actionType}`,
    payload: { id, actionType: input.actionType },
    result: 'info',
  });

  return id;
}

export async function processPendingQueue() {
  const baseUrl = await getSetting('device_base_url');
  if (!baseUrl) {
    throw new Error('Device base URL is empty');
  }

  const items = await listPendingQueuedActions();

  for (const item of items) {
    if (item.retryCount >= MAX_RETRIES) {
      await writeAudit({
        eventType: 'QUEUE_SKIPPED',
        description: 'Skipped queued action due to retry limit',
        payload: {
          id: item.id,
          actionType: item.actionType,
          retryCount: item.retryCount,
        },
        result: 'failure',
      });
      continue;
    }

    await markQueuedActionProcessing(item.id);

    await writeAudit({
      eventType: 'QUEUE_PROCESS_START',
      description: `Processing ${item.actionType}`,
      payload: { id: item.id, retryCount: item.retryCount },
      result: 'info',
    });

    try {
      const payload = JSON.parse(item.payloadJson) as Record<string, unknown>;

      if (item.actionType === 'SEND_COMMAND') {
        await sendCommand(baseUrl, payload as never);
      } else if (item.actionType === 'DEPLOY_PACKAGE') {
        await deployPackage(baseUrl, payload as never);
      } else {
        throw new Error(`Unsupported action type: ${item.actionType}`);
      }

      await markQueuedActionSuccess(item.id);

      await writeAudit({
        eventType: 'QUEUE_PROCESS_SUCCESS',
        description: `${item.actionType} processed successfully`,
        payload: { id: item.id, actionType: item.actionType },
        result: 'success',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown queue error';

      await markQueuedActionFailed(item.id, message);

      await writeAudit({
        eventType: 'QUEUE_PROCESS_FAILURE',
        description: `${item.actionType} failed`,
        payload: {
          id: item.id,
          actionType: item.actionType,
          error: message,
        },
        result: 'failure',
      });
    }
  }
}