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

export interface LogEntry {
  id: string;
  level: LogLevel;
  source: string;
  message: string;
  metadataJson: string | null;
  createdAt: string;
  syncedAt: string | null;
}

export interface AuditEntry {
  id: string;
  eventType: string;
  description: string;
  payloadJson: string | null;
  result: 'success' | 'failure' | 'info';
  createdAt: string;
}

export interface AppSetting {
  key: string;
  value: string;
  updatedAt: string;
}
