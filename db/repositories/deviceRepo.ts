import type { DeviceStatusResponse } from '@/api/types';
import type { DeviceStatus, ModuleStatus } from '@/types/domain';
import { getDb } from '../index';

type DeviceStatusRow = {
  id: string;
  device_name: string;
  connection_state: 'online' | 'offline' | 'unknown';
  battery_level: number | null;
  cpu_usage: number | null;
  memory_usage: number | null;
  uptime: number | null;
  last_synced_at: string | null;
  updated_at: string;
};

type ModuleStatusRow = {
  id: string;
  module_name: string;
  status: 'healthy' | 'warning' | 'error';
  severity: 'healthy' | 'warning' | 'error';
  message: string;
  updated_at: string;
};

function mapDevice(row: DeviceStatusRow): DeviceStatus {
  return {
    id: row.id,
    deviceName: row.device_name,
    connectionState: row.connection_state,
    batteryLevel: row.battery_level,
    cpuUsage: row.cpu_usage,
    memoryUsage: row.memory_usage,
    uptime: row.uptime,
    lastSyncedAt: row.last_synced_at,
    updatedAt: row.updated_at
  };
}

function mapModule(row: ModuleStatusRow): ModuleStatus {
  return {
    id: row.id,
    moduleName: row.module_name,
    status: row.status,
    severity: row.severity,
    message: row.message,
    updatedAt: row.updated_at
  };
}

function moduleIdFromName(name: string) {
  return `module-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

export async function getLatestDeviceStatus(): Promise<DeviceStatus | null> {
  const db = getDb();
  const row = await db.getFirstAsync<DeviceStatusRow>(
    `
    SELECT *
    FROM device_status
    ORDER BY updated_at DESC
    LIMIT 1
    `
  );

  return row ? mapDevice(row) : null;
}

export async function listModuleStatuses(): Promise<ModuleStatus[]> {
  const db = getDb();
  const rows = await db.getAllAsync<ModuleStatusRow>(
    `
    SELECT *
    FROM module_status
    ORDER BY module_name ASC
    `
  );

  return rows.map(mapModule);
}

export async function replaceDeviceSnapshot(
  payload: DeviceStatusResponse
): Promise<void> {
  const db = getDb();
  const now = new Date().toISOString();

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `
      INSERT INTO device_status (
        id, device_name, connection_state, battery_level, cpu_usage, memory_usage, uptime, last_synced_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        device_name = excluded.device_name,
        connection_state = excluded.connection_state,
        battery_level = excluded.battery_level,
        cpu_usage = excluded.cpu_usage,
        memory_usage = excluded.memory_usage,
        uptime = excluded.uptime,
        last_synced_at = excluded.last_synced_at,
        updated_at = excluded.updated_at
      `,
      [
        'device-1',
        payload.deviceName,
        payload.connectionState,
        payload.batteryLevel,
        payload.cpuUsage,
        payload.memoryUsage,
        payload.uptime,
        now,
        now
      ]
    );

    await db.runAsync(`DELETE FROM module_status`);

    for (const module of payload.modules) {
      await db.runAsync(
        `
        INSERT INTO module_status (
          id, module_name, status, severity, message, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          moduleIdFromName(module.name),
          module.name,
          module.status,
          module.status,
          module.message,
          now
        ]
      );
    }
  });
}
