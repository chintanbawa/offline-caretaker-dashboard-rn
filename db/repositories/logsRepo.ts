import type { DeviceLogResponse } from '@/api/types';
import type { LogEntry, LogLevel } from '@/types/domain';
import { getDb } from '../index';

type LogRow = {
  id: string;
  level: LogLevel;
  source: string;
  message: string;
  metadata_json: string | null;
  created_at: string;
  synced_at: string | null;
};

function mapLog(row: LogRow): LogEntry {
  return {
    id: row.id,
    level: row.level,
    source: row.source,
    message: row.message,
    metadataJson: row.metadata_json,
    createdAt: row.created_at,
    syncedAt: row.synced_at
  };
}

export async function listLogs(filters?: {
  level?: LogLevel | 'all';
  source?: string | 'all';
}): Promise<LogEntry[]> {
  const db = getDb();

  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (filters?.level && filters.level !== 'all') {
    conditions.push('level = ?');
    params.push(filters.level);
  }

  if (filters?.source && filters.source !== 'all') {
    conditions.push('source = ?');
    params.push(filters.source);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  const rows = await db.getAllAsync<LogRow>(
    `
    SELECT *
    FROM logs
    ${whereClause}
    ORDER BY created_at DESC
    `,
    params
  );

  return rows.map(mapLog);
}

export async function listLogSources(): Promise<string[]> {
  const db = getDb();
  const rows = await db.getAllAsync<{ source: string }>(
    `
    SELECT DISTINCT source
    FROM logs
    ORDER BY source ASC
    `
  );

  return rows.map(row => row.source);
}

export async function replaceLogs(items: DeviceLogResponse): Promise<void> {
  const db = getDb();
  const now = new Date().toISOString();

  await db.withTransactionAsync(async () => {
    await db.runAsync(`DELETE FROM logs`);

    for (const item of items) {
      const createdAt =
        typeof item.metadata?.timestamp === 'string'
          ? item.metadata.timestamp
          : now;

      await db.runAsync(
        `
        INSERT INTO logs (
          id, level, source, message, metadata_json, created_at, synced_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          item.id,
          item.level,
          item.source,
          item.message,
          JSON.stringify(item.metadata ?? {}),
          createdAt,
          now
        ]
      );
    }
  });
}
