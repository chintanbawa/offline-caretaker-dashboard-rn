import type {
  BleDeviceInfo,
  BleDiscoveredDevice,
  BleNetworkBootstrap
} from '@/types/ble';
import { Buffer } from 'buffer';
import { BleManager, Device } from 'react-native-ble-plx';

const SERVICE_UUID = 'E2C20303-9DD5-4CBA-A51E-B738BAE57A41';
const DEVICE_INFO_UUID = '5A87B2E3-67C7-418E-9806-C9E6A1694A28';
const NETWORK_BOOTSTRAP_UUID = '91823B5A-5D1A-4C23-8B39-50E868735399';

const manager = new BleManager();

function decodeBase64Json<T>(value: string | null): T {
  if (!value) {
    throw new Error('Characteristic value is empty');
  }

  const text = Buffer.from(value, 'base64').toString('utf8');
  return JSON.parse(text) as T;
}

export function getBleManager() {
  return manager;
}

export async function destroyBleManager() {
  manager.destroy();
}

export async function scanForEdgeDevices(
  onDevice: (device: BleDiscoveredDevice) => void
): Promise<() => void> {
  const seen = new Set<string>();

  manager.startDeviceScan(null, null, (error, device) => {
    if (error) {
      console.error('BLE scan error', error);
      return;
    }

    if (!device?.id) return;

    const serviceUUIDs = device.serviceUUIDs ?? [];
    const name = device.name ?? device.localName ?? null;

    const hasExpectedService = serviceUUIDs.some(
      uuid => uuid.toLowerCase() === SERVICE_UUID.toLowerCase()
    );

    const hasExpectedName =
      !!name && (name.includes('EdgeNode') || name.includes('Mac'));

    if (!hasExpectedService && !hasExpectedName) {
      return;
    }

    seen.add(device.id);

    onDevice({
      id: device.id,
      name,
      rssi: device.rssi ?? null
    });
  });

  return () => {
    manager.stopDeviceScan();
  };
}

export async function connectToBleDevice(deviceId: string): Promise<Device> {
  const device = await manager.connectToDevice(deviceId, { timeout: 10000 });
  await device.discoverAllServicesAndCharacteristics();
  return device;
}

export async function readDeviceInfo(device: Device): Promise<BleDeviceInfo> {
  const characteristic = await device.readCharacteristicForService(
    SERVICE_UUID,
    DEVICE_INFO_UUID
  );

  return decodeBase64Json<BleDeviceInfo>(characteristic.value);
}

export async function readNetworkBootstrap(
  device: Device
): Promise<BleNetworkBootstrap> {
  const characteristic = await device.readCharacteristicForService(
    SERVICE_UUID,
    NETWORK_BOOTSTRAP_UUID
  );

  return decodeBase64Json<BleNetworkBootstrap>(characteristic.value);
}

export async function disconnectBleDevice(deviceId: string) {
  await manager.cancelDeviceConnection(deviceId);
}
