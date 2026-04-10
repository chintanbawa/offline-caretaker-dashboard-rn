export type ConnectionState = 'online' | 'offline' | 'unknown';

export type ModuleHealth = 'healthy' | 'warning' | 'error';

export type LogLevel = 'info' | 'warning' | 'error';

export interface DeviceStatus {
  id: string;
  deviceName: string;
  connectionState: ConnectionState;
  batteryLevel: number | null;
  cpuUsage: number | null;
  memoryUsage: number | null;
  uptime: number | null;
  lastSyncedAt: string | null;
  updatedAt: string;
}

export interface ModuleStatus {
  id: string;
  moduleName: string;
  status: ModuleHealth;
  severity: ModuleHealth;
  message: string;
  updatedAt: string;
}
