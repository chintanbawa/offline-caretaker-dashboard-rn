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

  const logs = [
    [
      'log-1',
      'error',
      'Motion Control',
      'Actuator timeout',
      JSON.stringify({ code: 'ACT_TIMEOUT', attempt: 2, timestamp: now }),
      now,
      now
    ],
    [
      'log-2',
      'warning',
      'Backup Service',
      'Backup duration elevated',
      JSON.stringify({ durationSec: 14, thresholdSec: 10 }),
      now,
      now
    ],
    [
      'log-3',
      'info',
      'Security Layer',
      'Signature validation cache refreshed',
      JSON.stringify({ entries: 4 }),
      now,
      now
    ],
    [
      'log-4',
      'info',
      'Semantic Engine',
      'Inference rules loaded',
      JSON.stringify({ ruleCount: 12 }),
      now,
      now
    ],
    [
      'log-5',
      'warning',
      'Motion Control',
      'High retry rate detected',
      JSON.stringify({ retriesLastMinute: 8 }),
      now,
      now
    ]
  ];

  for (const log of logs) {
    await db.runAsync(
      `
        INSERT INTO logs (
          id, level, source, message, metadata_json, created_at, synced_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
      log
    );
  }

  const auditEntries = [
    ['audit-1', 'APP_INIT', 'Application initialized', null, 'info', now],
    [
      'audit-2',
      'SEED_DATA',
      'Seeded local database with demo records',
      null,
      'success',
      now
    ],
    [
      'audit-3',
      'SETTINGS_SAVE',
      'Saved default device base URL',
      JSON.stringify({ deviceBaseUrl: 'http://192.168.1.10:3000' }),
      'success',
      now
    ]
  ];

  for (const entry of auditEntries) {
    await db.runAsync(
      `
        INSERT INTO audit_trail (
          id, event_type, description, payload_json, result, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
      entry
    );
  }
}
