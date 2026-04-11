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
