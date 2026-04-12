export type DeviceStatusResponse = {
  deviceName: string;
  connectionState: 'online' | 'offline' | 'unknown';
  batteryLevel: number;
  cpuUsage: number;
  memoryUsage: number;
  uptime: number;
  modules: Array<{
    name: string;
    status: 'healthy' | 'warning' | 'error';
    message: string;
  }>;
};

export type DeviceLogResponse = Array<{
  id: string;
  level: 'info' | 'warning' | 'error';
  source: string;
  message: string;
  metadata: Record<string, unknown>;
}>;

export type DeviceBackupResponse = Array<{
  id: string;
  backupDate: string;
  status: 'success' | 'failure';
  metadata: Record<string, unknown>;
}>;

export type CommandRequest = {
  type: 'RESTART_MODULE';
  payload: {
    module: string;
  };
};

export type CommandResponse = {
  success: boolean;
  message: string;
};
