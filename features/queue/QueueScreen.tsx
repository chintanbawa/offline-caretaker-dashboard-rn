import { Screen } from '@/components/Screen';
import { useQueueStore } from '@/store/queueStore';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View
} from 'react-native';

export function QueueScreen() {
  const {
    items,
    isLoading,
    isProcessing,
    error,
    load,
    retryPending
  } = useQueueStore();

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Screen title='Queue' subtitle='Pending and processed mutation actions'>
      <Button
        title={isProcessing ? 'Retrying...' : 'Retry Pending Actions'}
        onPress={retryPending}
        disabled={isProcessing}
      />

      {isLoading ? <ActivityIndicator /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.list}>
        {items.map(item => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.title}>{item.actionType}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Retries: {item.retryCount}</Text>
            <Text>Created: {item.createdAt}</Text>
            {item.lastError ? (
              <Text style={styles.error}>Last Error: {item.lastError}</Text>
            ) : null}
          </View>
        ))}
      </View>
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
  error: {
    color: 'red'
  }
});
