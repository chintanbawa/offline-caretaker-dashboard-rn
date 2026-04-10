import { Screen } from '@/components/Screen';
import { StatTile } from '@/components/StatTile';
import { useDashboardStore } from '@/store/dashboardStore';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

function formatUptime(seconds: number | null) {
  if (seconds == null) return '—';

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  return `${hrs}h ${mins}m`;
}

export function DashboardScreen() {
  const { isLoading, deviceStatus, modules, error, load } = useDashboardStore();

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Screen title='Dashboard' subtitle='Local-first device snapshot'>
      {isLoading ? <ActivityIndicator /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {deviceStatus ? (
        <>
          <StatTile label='Device' value={deviceStatus.deviceName} />
          <StatTile label='Connection' value={deviceStatus.connectionState} />
          <StatTile
            label='Battery'
            value={
              deviceStatus.batteryLevel != null
                ? `${deviceStatus.batteryLevel}%`
                : '—'
            }
          />
          <StatTile
            label='CPU Usage'
            value={
              deviceStatus.cpuUsage != null ? `${deviceStatus.cpuUsage}%` : '—'
            }
          />
          <StatTile
            label='Memory Usage'
            value={
              deviceStatus.memoryUsage != null
                ? `${deviceStatus.memoryUsage}%`
                : '—'
            }
          />
          <StatTile label='Uptime' value={formatUptime(deviceStatus.uptime)} />
          <StatTile
            label='Last Synced'
            value={deviceStatus.lastSyncedAt ?? '—'}
          />
        </>
      ) : (
        <Text>No device status found.</Text>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Modules</Text>

        {modules.map(module => (
          <View key={module.id} style={styles.moduleCard}>
            <Text style={styles.moduleName}>{module.moduleName}</Text>
            <Text>{module.status}</Text>
            <Text>{module.message}</Text>
            <Text style={styles.timestamp}>{module.updatedAt}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: {
    color: 'red'
  },
  section: {
    marginTop: 8,
    gap: 8
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700'
  },
  moduleCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    gap: 4
  },
  moduleName: {
    fontWeight: '700'
  },
  timestamp: {
    fontSize: 12,
    color: '#777'
  }
});
