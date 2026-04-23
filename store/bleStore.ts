import { saveSetting } from '@/db/repositories/settingsRepo';
import { writeAudit } from '@/services/auditService';
import {
  connectToBleDevice,
  disconnectBleDevice,
  readDeviceInfo,
  readNetworkBootstrap,
  scanForEdgeDevices
} from '@/services/bleService';
import { requestBlePermissions } from '@/services/permissionsService';
import type {
  BleDeviceInfo,
  BleDiscoveredDevice,
  BleNetworkBootstrap
} from '@/types/ble';
import { create } from 'zustand';

type BleStore = {
  devices: BleDiscoveredDevice[];
  selectedDeviceId: string | null;
  deviceInfo: BleDeviceInfo | null;
  bootstrap: BleNetworkBootstrap | null;
  isScanning: boolean;
  isConnecting: boolean;
  error: string | null;
  stopScan: (() => void) | null;
  startScan: () => Promise<void>;
  stopScanning: () => void;
  connectAndBootstrap: (deviceId: string) => Promise<void>;
  disconnect: () => Promise<void>;
};

export const useBleStore = create<BleStore>((set, get) => ({
  devices: [],
  selectedDeviceId: null,
  deviceInfo: null,
  bootstrap: null,
  isScanning: false,
  isConnecting: false,
  error: null,
  stopScan: null,

  startScan: async () => {
    set({
      devices: [],
      isScanning: true,
      error: null
    });

    const allowed = await requestBlePermissions();

    if (!allowed) {
      await writeAudit({
        eventType: 'BLE_PERMISSION_DENIED',
        description: 'BLE permissions were denied',
        result: 'failure'
      });

      set({
        isScanning: false,
        error: 'Bluetooth permissions not granted'
      });
      return;
    }

    await writeAudit({
      eventType: 'BLE_SCAN_START',
      description: 'Started BLE scan',
      result: 'info'
    });

    const stop = await scanForEdgeDevices(async device => {
      set(state => {
        const exists = state.devices.some(d => d.id === device.id);
        if (exists) return state;
        return { devices: [...state.devices, device] };
      });

      await writeAudit({
        eventType: 'BLE_DEVICE_FOUND',
        description: 'Discovered BLE device',
        payload: { id: device.id, name: device.name, rssi: device.rssi },
        result: 'info'
      });
    });

    set({ stopScan: stop });
  },

  stopScanning: () => {
    get().stopScan?.();
    set({ isScanning: false, stopScan: null });
  },

  connectAndBootstrap: async (deviceId: string) => {
    set({
      isConnecting: true,
      error: null,
      selectedDeviceId: deviceId,
      deviceInfo: null,
      bootstrap: null
    });

    try {
      get().stopScan?.();

      const device = await connectToBleDevice(deviceId);
      const [deviceInfo, bootstrap] = await Promise.all([
        readDeviceInfo(device),
        readNetworkBootstrap(device)
      ]);

      await saveSetting('device_base_url', bootstrap.baseUrl);

      await writeAudit({
        eventType: 'BLE_BOOTSTRAP_SUCCESS',
        description: 'Connected over BLE and saved network bootstrap',
        payload: {
          deviceId,
          deviceInfo,
          bootstrap
        },
        result: 'success'
      });

      set({
        isConnecting: false,
        isScanning: false,
        stopScan: null,
        deviceInfo,
        bootstrap
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'BLE bootstrap failed';

      await writeAudit({
        eventType: 'BLE_BOOTSTRAP_FAILURE',
        description: 'BLE bootstrap failed',
        payload: { deviceId, error: message },
        result: 'failure'
      });

      set({
        isConnecting: false,
        error: message
      });
    }
  },

  disconnect: async () => {
    const deviceId = get().selectedDeviceId;
    if (!deviceId) return;

    try {
      await disconnectBleDevice(deviceId);

      await writeAudit({
        eventType: 'BLE_DISCONNECT',
        description: 'Disconnected BLE device',
        payload: { deviceId },
        result: 'info'
      });
    } finally {
      set({
        selectedDeviceId: null,
        deviceInfo: null,
        bootstrap: null
      });
    }
  }
}));
