import { getDb } from '../index';

export type QueuedActionStatus =
  | 'pending'
  | 'processing'
  | 'success'
  | 'failed';

export type QueuedActionType = 'SEND_COMMAND' | 'DEPLOY_PACKAGE';

export type QueuedAction = {
  id: string;
  actionType: QueuedActionType;
  payloadJson: string;
  status: QueuedActionStatus;
  retryCount: number;
  lastError: string | null;
  createdAt: string;
  processedAt: string | null;
};

type QueuedActionRow = {
  id: string;
  action_type: QueuedActionType;
  payload_json: string;
  status: QueuedActionStatus;
  retry_count: number;
  last_error: string | null;
  created_at: string;
  processed_at: string | null;
};

function mapRow(row: QueuedActionRow): QueuedAction {
  return {
    id: row.id,
    actionType: row.action_type,
    payloadJson: row.payload_json,
    status: row.status,
    retryCount: row.retry_count,
    lastError: row.last_error,
    createdAt: row.created_at,
    processedAt: row.processed_at
  };
}

export async function insertQueuedAction(input: {
  id: string;
  actionType: QueuedActionType;
  payloadJson: string;
}) {
  const db = getDb();
  const createdAt = new Date().toISOString();

  await db.runAsync(
    `
    INSERT INTO queued_actions (
      id, action_type, payload_json, status, retry_count, last_error, created_at, processed_at
    )
    VALUES (?, ?, ?, 'pending', 0, NULL, ?, NULL)
    `,
    [input.id, input.actionType, input.payloadJson, createdAt]
  );
}

export async function listPendingQueuedActions(
  limit = 50
): Promise<QueuedAction[]> {
  const db = getDb();
  const rows = await db.getAllAsync<QueuedActionRow>(
    `
    SELECT *
    FROM queued_actions
    WHERE status IN ('pending', 'failed')
    ORDER BY created_at ASC
    LIMIT ?
    `,
    [limit]
  );

  return rows.map(mapRow);
}

export async function markQueuedActionProcessing(id: string) {
  const db = getDb();
  await db.runAsync(
    `
    UPDATE queued_actions
    SET status = 'processing'
    WHERE id = ?
    `,
    [id]
  );
}

export async function markQueuedActionSuccess(id: string) {
  const db = getDb();
  await db.runAsync(
    `
    UPDATE queued_actions
    SET status = 'success',
        processed_at = ?,
        last_error = NULL
    WHERE id = ?
    `,
    [new Date().toISOString(), id]
  );
}

export async function markQueuedActionFailed(id: string, errorMessage: string) {
  const db = getDb();
  await db.runAsync(
    `
    UPDATE queued_actions
    SET status = 'failed',
        retry_count = retry_count + 1,
        last_error = ?
    WHERE id = ?
    `,
    [errorMessage, id]
  );
}

export async function listRecentQueuedActions(
  limit = 100
): Promise<QueuedAction[]> {
  const db = getDb();
  const rows = await db.getAllAsync<QueuedActionRow>(
    `
    SELECT *
    FROM queued_actions
    ORDER BY created_at DESC
    LIMIT ?
    `,
    [limit]
  );

  return rows.map(mapRow);
}
