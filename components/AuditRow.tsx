import type { AuditEntry } from '@/types/domain';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  item: AuditEntry;
};

export function AuditRow({ item }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.event}>{item.eventType}</Text>
        <Text style={styles.result}>{item.result.toUpperCase()}</Text>
      </View>

      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.timestamp}>{item.createdAt}</Text>

      {item.payloadJson ? (
        <Text style={styles.payload}>{item.payloadJson}</Text>
      ) : null}
    </View>
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
  event: {
    fontWeight: '700'
  },
  result: {
    color: '#555'
  },
  description: {
    fontSize: 15
  },
  timestamp: {
    fontSize: 12,
    color: '#777'
  },
  payload: {
    fontSize: 12,
    color: '#444'
  }
});
