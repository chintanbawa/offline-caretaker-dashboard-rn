import { fetchHealth, fetchStatus } from '@/api/deviceApi';
import { replaceDeviceSnapshot } from '@/db/repositories/deviceRepo';
import { writeAudit } from './auditService';

export async function testDeviceConnection(baseUrl: string) {
  const result = await fetchHealth(baseUrl);

  await writeAudit({
    eventType: 'CONNECTION_TEST',
    description: 'Tested device connection',
    payload: { baseUrl, ok: result?.ok, service: result?.service },
    result: result?.ok ? 'success' : 'failure'
  });

  return result;
}

export async function syncDeviceSnapshot(baseUrl: string) {
  await writeAudit({
    eventType: 'SYNC_START',
    description: 'Started device sync',
    payload: { baseUrl },
    result: 'info'
  });

  try {
    const [status] = await Promise.all([fetchStatus(baseUrl)]);

    await replaceDeviceSnapshot(status);

    await writeAudit({
      eventType: 'SYNC_SUCCESS',
      description: 'Synced status',
      payload: {
        baseUrl,
        moduleCount: status.modules.length
      },
      result: 'success'
    });

    return {
      status
    };
  } catch (error) {
    await writeAudit({
      eventType: 'SYNC_FAILURE',
      description: 'Device sync failed',
      payload: {
        baseUrl,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      result: 'failure'
    });

    throw error;
  }
}
