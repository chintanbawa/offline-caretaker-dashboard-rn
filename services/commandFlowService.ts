import z from 'zod';
import { writeAudit } from './auditService';
import { enqueueAction, processPendingQueue } from './queueService';
import { commandSchema } from './validationService';

export async function submitRestartModuleCommand(moduleName: string) {
  const payload = {
    type: 'RESTART_MODULE' as const,
    payload: {
      module: moduleName.trim()
    }
  };

  const parsed = commandSchema.safeParse(payload);

  if (!parsed.success) {
    await writeAudit({
      eventType: 'COMMAND_VALIDATION_ERROR',
      description: 'Command validation failed',
      payload: { issues: z.treeifyError(parsed.error) },
      result: 'failure'
    });

    throw new Error('Invalid command payload');
  }

  const queueId = await enqueueAction({
    actionType: 'SEND_COMMAND',
    payload: parsed.data
  });

  try {
    await processPendingQueue();

    await writeAudit({
      eventType: 'COMMAND_SUBMIT',
      description: 'Restart module command submitted',
      payload: { queueId, moduleName: parsed.data.payload.module },
      result: 'success'
    });

    return {
      queued: true,
      queueId,
      message: 'Command accepted and processed if device was reachable'
    };
  } catch (error) {
    await writeAudit({
      eventType: 'COMMAND_SUBMIT_DEFERRED',
      description: 'Command queued for later retry',
      payload: {
        queueId,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      result: 'info'
    });

    return {
      queued: true,
      queueId,
      message: 'Command queued. Device not reachable right now.'
    };
  }
}
