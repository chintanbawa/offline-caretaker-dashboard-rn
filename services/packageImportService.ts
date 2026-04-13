import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';

export async function importJsonPackageFile(): Promise<{
  rawText: string;
  parsed: Record<string, unknown>;
}> {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/json',
    copyToCacheDirectory: true,
    multiple: false
  });

  if (result.canceled) {
    throw new Error('File selection canceled');
  }

  const asset = result.assets[0];
  const file = new File(asset.uri);
  const rawText = file.textSync();

  let parsed: Record<string, unknown>;

  try {
    parsed = JSON.parse(rawText) as Record<string, unknown>;
  } catch {
    throw new Error('Selected file is not valid JSON');
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Package file must contain a JSON object');
  }

  return { rawText, parsed };
}
