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
