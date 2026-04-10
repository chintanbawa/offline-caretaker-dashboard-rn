import * as SQLite from 'expo-sqlite';

function nowIso() {
  return new Date().toISOString();
}

export async function seedDatabaseIfNeeded(db: SQLite.SQLiteDatabase) {
  const deviceCount = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM device_status'
  );

  if ((deviceCount?.count ?? 0) > 0) {
    return;
  }

  const now = nowIso();

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `
      INSERT INTO device_status (
        id, device_name, connection_state, battery_level, cpu_usage, memory_usage, uptime, last_synced_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      ['device-1', 'Edge Node 01', 'unknown', 78, 23, 61, 128340, now, now]
    );

    const modules = [
      [
        'module-semantic',
        'Semantic Engine',
        'healthy',
        'healthy',
        'Nominal',
        now
      ],
      [
        'module-motion',
        'Motion Control',
        'warning',
        'warning',
        'Actuator latency elevated',
        now
      ],
      [
        'module-security',
        'Security Layer',
        'healthy',
        'healthy',
        'All checks passed',
        now
      ],
      [
        'module-backup',
        'Backup Service',
        'healthy',
        'healthy',
        'Last backup completed',
        now
      ]
    ];

    for (const mod of modules) {
      await db.runAsync(
        `
        INSERT INTO module_status (
          id, module_name, status, severity, message, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        mod
      );
    }
  });
}
