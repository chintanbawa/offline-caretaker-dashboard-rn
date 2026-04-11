import type { DeviceBackupResponse } from '@/api/types';
import type { BackupEntry } from '@/types/domain';
import { getDb } from '../index';

type BackupRow = {
  id: string;
  backup_date: string;
  status: 'success' | 'failure';
  metadata_json: string | null;
  created_at: string;
};

function mapBackup(row: BackupRow): BackupEntry {
  return {
    id: row.id,
    backupDate: row.backup_date,
    status: row.status,
    metadataJson: row.metadata_json,
    createdAt: row.created_at
  };
}

export async function listBackups(): Promise<BackupEntry[]> {
  const db = getDb();
  const rows = await db.getAllAsync<BackupRow>(
    `
    SELECT *
    FROM backup_entries
    ORDER BY backup_date DESC
    `
  );

  return rows.map(mapBackup);
}

export async function replaceBackups(
  items: DeviceBackupResponse
): Promise<void> {
  const db = getDb();
  const now = new Date().toISOString();

  await db.withTransactionAsync(async () => {
    await db.runAsync(`DELETE FROM backup_entries`);

    for (const item of items) {
      await db.runAsync(
        `
        INSERT INTO backup_entries (
          id, backup_date, status, metadata_json, created_at
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          item.id,
          item.backupDate,
          item.status,
          JSON.stringify(item.metadata ?? {}),
          now
        ]
      );
    }
  });
}
