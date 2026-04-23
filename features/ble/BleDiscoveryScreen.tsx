import { Screen } from '@/components/Screen';
import { useBleStore } from '@/store/bleStore';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  Button,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';

export function BleDiscoveryScreen() {
  const {
    devices,
    deviceInfo,
    bootstrap,
    isScanning,
    isConnecting,
    error,
    startScan,
    stopScanning,
    connectAndBootstrap
  } = useBleStore();

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, [stopScanning]);

  return (
    <Screen
      title='BLE Discovery'
      subtitle='Discover nearby edge devices and bootstrap Wi-Fi config'
    >
      <Button
        title={isScanning ? 'Stop Scan' : 'Start BLE Scan'}
        onPress={isScanning ? stopScanning : startScan}
        disabled={isConnecting}
      />

      {isScanning ? <ActivityIndicator /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.list}>
        {devices.map(device => (
          <Pressable
            key={device.id}
            style={styles.card}
            onPress={() => connectAndBootstrap(device.id)}
            disabled={isConnecting}
          >
            <Text style={styles.title}>{device.name ?? 'Unnamed Device'}</Text>
            <Text>ID: {device.id}</Text>
            <Text>RSSI: {device.rssi ?? '—'}</Text>
          </Pressable>
        ))}
      </View>

      {deviceInfo ? (
        <View style={styles.resultCard}>
          <Text style={styles.sectionTitle}>Device Info</Text>
          <Text>Name: {deviceInfo.deviceName}</Text>
          <Text>ID: {deviceInfo.deviceId}</Text>
          <Text>Firmware: {deviceInfo.firmware}</Text>
        </View>
      ) : null}

      {bootstrap ? (
        <View style={styles.resultCard}>
          <Text style={styles.sectionTitle}>Network Bootstrap</Text>
          <Text>Base URL: {bootstrap.baseUrl}</Text>
          <Text>Transport: {bootstrap.transport}</Text>
          <Text style={styles.note}>
            Saved to Settings. You can now use Test Connection and Sync Now over
            Wi-Fi.
          </Text>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    gap: 4
  },
  title: {
    fontWeight: '700'
  },
  resultCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    gap: 4
  },
  sectionTitle: {
    fontWeight: '700'
  },
  note: {
    color: '#666'
  },
  error: {
    color: 'red'
  }
});
