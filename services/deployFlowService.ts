import { writeAudit } from './auditService';
import { enqueueAction, processPendingQueue } from './queueService';
import { signDeployPayload } from './securityService';
import { deploySchema } from './validationService';

export async function submitDeployPackage(input: {
  packageName: string;
  version: string;
  payload: Record<string, unknown>;
}) {
  const parsed = deploySchema.safeParse({
    packageName: input.packageName.trim(),
    version: input.version.trim(),
    payload: input.payload
  });

  if (!parsed.success) {
    await writeAudit({
      eventType: 'DEPLOY_VALIDATION_ERROR',
      description: 'Deploy validation failed',
      payload: { issues: parsed.error.flatten() },
      result: 'failure'
    });

    throw new Error('Invalid deploy payload');
  }

  const signature = await signDeployPayload(parsed.data);

  const finalPayload = {
    ...parsed.data,
    signature
  };

  const queueId = await enqueueAction({
    actionType: 'DEPLOY_PACKAGE',
    payload: finalPayload
  });

  try {
    await processPendingQueue();

    await writeAudit({
      eventType: 'DEPLOY_SUBMIT',
      description: 'Deploy package submitted',
      payload: {
        queueId,
        packageName: parsed.data.packageName,
        version: parsed.data.version
      },
      result: 'success'
    });

    return {
      queued: true,
      queueId,
      message: 'Deploy submitted and processed if device was reachable'
    };
  } catch (error) {
    await writeAudit({
      eventType: 'DEPLOY_SUBMIT_DEFERRED',
      description: 'Deploy queued for later retry',
      payload: {
        queueId,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      result: 'info'
    });

    return {
      queued: true,
      queueId,
      message: 'Deploy queued. Device not reachable right now.'
    };
  }
}
