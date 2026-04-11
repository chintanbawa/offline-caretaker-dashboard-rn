export const MIGRATIONS: string[] = [
  `
  CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY NOT NULL
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS device_status (
    id TEXT PRIMARY KEY NOT NULL,
    device_name TEXT NOT NULL,
    connection_state TEXT NOT NULL,
    battery_level INTEGER,
    cpu_usage INTEGER,
    memory_usage INTEGER,
    uptime INTEGER,
    last_synced_at TEXT,
    updated_at TEXT NOT NULL
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS module_status (
    id TEXT PRIMARY KEY NOT NULL,
    module_name TEXT NOT NULL,
    status TEXT NOT NULL,
    severity TEXT NOT NULL,
    message TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS logs (
    id TEXT PRIMARY KEY NOT NULL,
    level TEXT NOT NULL,
    source TEXT NOT NULL,
    message TEXT NOT NULL,
    metadata_json TEXT,
    created_at TEXT NOT NULL,
    synced_at TEXT
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS backup_entries (
    id TEXT PRIMARY KEY NOT NULL,
    backup_date TEXT NOT NULL,
    status TEXT NOT NULL,
    metadata_json TEXT,
    created_at TEXT NOT NULL
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS audit_trail (
    id TEXT PRIMARY KEY NOT NULL,
    event_type TEXT NOT NULL,
    description TEXT NOT NULL,
    payload_json TEXT,
    result TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  `
];
