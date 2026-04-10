import { AuditRow } from '@/components/AuditRow';
import { Screen } from '@/components/Screen';
import { useAuditStore } from '@/store/auditStore';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export function AuditScreen() {
  const { isLoading, entries, error, load } = useAuditStore();

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Screen title='Audit Trail' subtitle='Durable local record of app actions'>
      {isLoading ? <ActivityIndicator /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.list}>
        {entries.map(item => (
          <AuditRow key={item.id} item={item} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10
  },
  error: {
    color: 'red'
  }
});
