import { BackupRow } from '@/components/BackupRow';
import { Screen } from '@/components/Screen';
import { useBackupsStore } from '@/store/backupsStore';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View
} from 'react-native';

export function BackupsScreen() {
  const router = useRouter();
  const { isLoading, backups, error, load } = useBackupsStore();

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Screen title='Backups' subtitle='Last known backup ledger'>
      {isLoading ? <ActivityIndicator /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.list}>
        {backups.map(item => (
          <BackupRow key={item.id} item={item} />
        ))}
      </View>
      <Button title='← Back' onPress={() => router.back()} />
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
