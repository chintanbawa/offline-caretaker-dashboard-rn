import { Screen } from '@/components/Screen';
import { useSettingsStore } from '@/store/settingsStore';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput
} from 'react-native';

export function SettingsScreen() {
  const {
    isLoading,
    isSaving,
    deviceBaseUrl,
    error,
    load,
    setDeviceBaseUrl,
    save
  } = useSettingsStore();

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
        placeholder='http://192.168.1.10:3000'
      />

      <Button
        title={isSaving ? 'Saving...' : 'Save'}
        onPress={save}
        disabled={isSaving || isLoading}
      />

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
  error: {
    color: 'red'
  }
});
