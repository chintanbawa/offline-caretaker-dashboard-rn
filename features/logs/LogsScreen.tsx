import { LogRow } from '@/components/LogRow';
import { Screen } from '@/components/Screen';
import { useLogsStore } from '@/store/logsStore';
import type { LogLevel } from '@/types/domain';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';

const LEVELS: (LogLevel | 'all')[] = ['all', 'info', 'warning', 'error'];

export function LogsScreen() {
  const {
    isLoading,
    logs,
    sources,
    selectedLevel,
    selectedSource,
    error,
    load,
    setLevel,
    setSource
  } = useLogsStore();

  useEffect(() => {
    load();
  }, [load, selectedLevel, selectedSource]);

  return (
    <Screen title='Logs' subtitle='Structured diagnostic logs'>
      <Text style={styles.label}>Filter by level</Text>
      <View style={styles.filters}>
        {LEVELS.map(level => (
          <Pressable
            key={level}
            style={[
              styles.filterChip,
              selectedLevel === level && styles.filterChipActive
            ]}
            onPress={() => setLevel(level)}
          >
            <Text>{level}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Filter by source</Text>
      <View style={styles.filters}>
        <Pressable
          style={[
            styles.filterChip,
            selectedSource === 'all' && styles.filterChipActive
          ]}
          onPress={() => setSource('all')}
        >
          <Text>all</Text>
        </Pressable>

        {sources.map(source => (
          <Pressable
            key={source}
            style={[
              styles.filterChip,
              selectedSource === source && styles.filterChipActive
            ]}
            onPress={() => setSource(source)}
          >
            <Text>{source}</Text>
          </Pressable>
        ))}
      </View>

      {isLoading ? <ActivityIndicator /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.list}>
        {logs.map(item => (
          <LogRow key={item.id} item={item} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: '700'
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  filterChip: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  filterChipActive: {
    backgroundColor: '#eee'
  },
  list: {
    gap: 10,
    marginTop: 8
  },
  error: {
    color: 'red'
  }
});
