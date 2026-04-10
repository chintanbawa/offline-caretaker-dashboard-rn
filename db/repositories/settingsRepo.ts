import { getDb } from '../index';

export async function getSetting(key: string): Promise<string | null> {
  const db = getDb();
  const row = await db.getFirstAsync<{ value: string }>(
    `
    SELECT value
    FROM settings
    WHERE key = ?
    LIMIT 1
    `,
    [key]
  );

  return row?.value ?? null;
}

export async function saveSetting(key: string, value: string): Promise<void> {
  const db = getDb();
  const updatedAt = new Date().toISOString();

  await db.runAsync(
    `
    INSERT INTO settings (key, value, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET
      value = excluded.value,
      updated_at = excluded.updated_at
    `,
    [key, value, updatedAt]
  );
}
