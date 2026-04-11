import type { BackupEntry } from '@/types/domain';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  item: BackupEntry;
};

export function BackupRow({ item }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable style={styles.card} onPress={() => setExpanded(prev => !prev)}>
      <View style={styles.topRow}>
        <Text style={styles.date}>{item.backupDate}</Text>
        <Text style={styles.status}>{item.status.toUpperCase()}</Text>
      </View>

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
    justifyContent: 'space-between'
  },
  date: {
    fontWeight: '700'
  },
  status: {
    color: '#555'
  },
  timestamp: {
    fontSize: 12,
    color: '#777'
  },
  metadata: {
    fontSize: 12,
    color: '#444'
  }
});
