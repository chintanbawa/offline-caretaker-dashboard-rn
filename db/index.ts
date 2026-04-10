import * as SQLite from 'expo-sqlite';
import { MIGRATIONS } from './migrations';
import { seedDatabaseIfNeeded } from './seed';

let dbInstance: SQLite.SQLiteDatabase | null = null;
let initialized = false;

export function getDb() {
  if (!dbInstance) {
    dbInstance = SQLite.openDatabaseSync('caretaker-dashboard.db');
  }
  return dbInstance;
}

async function getCurrentSchemaVersion(
  db: SQLite.SQLiteDatabase
): Promise<number> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY NOT NULL
    );
  `);

  const row = await db.getFirstAsync<{ version: number }>(
    'SELECT MAX(version) as version FROM schema_migrations'
  );

  return row?.version ?? 0;
}

async function applyMigrations(db: SQLite.SQLiteDatabase) {
  const currentVersion = await getCurrentSchemaVersion(db);

  for (let i = currentVersion; i < MIGRATIONS.length; i += 1) {
    const nextVersion = i + 1;
    await db.withTransactionAsync(async () => {
      await db.execAsync(MIGRATIONS[i]);
      await db.runAsync('INSERT INTO schema_migrations (version) VALUES (?)', [
        nextVersion
      ]);
    });
  }
}

export async function initializeDatabase() {
  if (initialized) return;

  const db = getDb();
  await applyMigrations(db);
  await seedDatabaseIfNeeded(db);

  initialized = true;
}
