import { Screen } from '@/components/Screen';
import { useDeployStore } from '@/store/deployStore';
import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export function DeployScreen() {
  const router = useRouter();
  const {
    packageName,
    version,
    payloadText,
    isSubmitting,
    isImporting,
    error,
    lastMessage,
    setPackageName,
    setVersion,
    setPayloadText,
    importPayloadFile,
    submit
  } = useDeployStore();

  return (
    <Screen
      title='Deploy Package'
      subtitle='Validate, import, sign, queue, and deploy locally'
    >
      <Text style={styles.label}>Package Name</Text>
      <TextInput
        style={styles.input}
        value={packageName}
        onChangeText={setPackageName}
      />

      <Text style={styles.label}>Version</Text>
      <TextInput
        style={styles.input}
        value={version}
        onChangeText={setVersion}
      />

      <View style={styles.buttonRow}>
        <Button
          title={isImporting ? 'Importing...' : 'Import JSON File'}
          onPress={importPayloadFile}
          disabled={isImporting || isSubmitting}
        />
      </View>

      <Text style={styles.label}>Payload JSON</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={payloadText}
        onChangeText={setPayloadText}
        multiline
        textAlignVertical='top'
      />

      <Button
        title={isSubmitting ? 'Submitting...' : 'Deploy Package'}
        onPress={submit}
        disabled={isSubmitting || isImporting}
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
  multiline: {
    minHeight: 160
  },
  buttonRow: {
    marginBottom: 4
  },
  message: {
    color: '#333'
  },
  error: {
    color: 'red'
  }
});
