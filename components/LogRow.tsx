import type { LogEntry } from '@/types/domain';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  item: LogEntry;
};

export function LogRow({ item }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable style={styles.card} onPress={() => setExpanded(prev => !prev)}>
      <View style={styles.topRow}>
        <Text style={styles.level}>{item.level.toUpperCase()}</Text>
        <Text style={styles.source}>{item.source}</Text>
      </View>

      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.timestamp}>{item.createdAt}</Text>

      {expanded && item.metadataJson ? (
        <Text style={styles.metadata}>{item.metadataJson}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    gap: 6
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12
  },
  level: {
    fontWeight: '700'
  },
  source: {
    color: '#555'
  },
  message: {
    fontSize: 15
  },
  timestamp: {
    fontSize: 12,
    color: '#777'
  },
  metadata: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#444',
    marginTop: 6
  }
});
