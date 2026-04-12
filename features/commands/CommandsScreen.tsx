import { Screen } from '@/components/Screen';
import { useCommandStore } from '@/store/commandStore';
import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, TextInput } from 'react-native';

export function CommandsScreen() {
  const router = useRouter();
  const {
    moduleName,
    isSubmitting,
    error,
    lastMessage,
    setModuleName,
    submit
  } = useCommandStore();

  return (
    <Screen title='Commands' subtitle='Queue and send local device commands'>
      <Text style={styles.label}>Module Name</Text>
      <TextInput
        style={styles.input}
        value={moduleName}
        onChangeText={setModuleName}
        placeholder='Motion Control'
      />

      <Button
        title={isSubmitting ? 'Submitting...' : 'Restart Module'}
        onPress={submit}
        disabled={isSubmitting}
      />

      <Button title='← Back' onPress={() => router.back()} />

      {lastMessage ? <Text style={styles.message}>{lastMessage}</Text> : null}
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
  message: {
    color: '#333'
  },
  error: {
    color: 'red'
  }
});
