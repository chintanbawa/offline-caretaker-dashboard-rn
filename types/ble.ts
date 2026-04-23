export type BleDiscoveredDevice = {
  id: string;
  name: string | null;
  rssi: number | null;
};

export type BleDeviceInfo = {
  deviceId: string;
  deviceName: string;
  firmware: string;
};

export type BleNetworkBootstrap = {
  baseUrl: string;
  transport: 'wifi-http';
};
