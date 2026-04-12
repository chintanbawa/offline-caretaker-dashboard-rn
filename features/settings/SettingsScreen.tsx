import { Screen } from '@/components/Screen';
import { useConnectionStore } from '@/store/connectionStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

export function SettingsScreen() {
  const router = useRouter();
  const {
    isLoading,
    isSaving,
    deviceBaseUrl,
    error,
    load,
    setDeviceBaseUrl,
    save
  } = useSettingsStore();

  const {
    isTesting,
    isSyncing,
    lastConnectionOk,
    lastMessage,
    testConnection,
    syncNow
  } = useConnectionStore();

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Screen title='Settings' subtitle='Local device connection settings'>
      {isLoading ? <ActivityIndicator /> : null}

      <Text style={styles.label}>Device Base URL</Text>
      <TextInput
        style={styles.input}
        value={deviceBaseUrl}
        onChangeText={setDeviceBaseUrl}
        autoCapitalize='none'
        autoCorrect={false}
        placeholder='http://192.168.1.15:3000'
      />

      <Button
        title={isSaving ? 'Saving...' : 'Save URL'}
        onPress={save}
        disabled={isSaving || isLoading}
      />

      <View style={styles.buttonGroup}>
        <Button
          title={isTesting ? 'Testing...' : 'Test Connection'}
          onPress={testConnection}
          disabled={isTesting || isSaving || isLoading}
        />
      </View>

      <View style={styles.buttonGroup}>
        <Button
          title={isSyncing ? 'Syncing...' : 'Sync Now'}
          onPress={syncNow}
          disabled={isSyncing || isSaving || isLoading}
        />
      </View>

      {lastMessage ? (
        <Text
          style={[styles.status, lastConnectionOk === false && styles.error]}
        >
          {lastMessage}
        </Text>
      ) : null}

      <Button title='← Back' onPress={() => router.back()} />

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: '700'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  buttonGroup: {
    marginTop: 8
  },
  status: {
    color: '#333'
  },
  error: {
    color: 'red'
  }
});
