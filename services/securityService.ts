import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

const SIGNING_SEED_KEY = 'signing_seed';

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(
      value as Record<string, unknown>
    ).sort(([a], [b]) => a.localeCompare(b));

    return `{${entries
      .map(([key, val]) => `${JSON.stringify(key)}:${stableStringify(val)}`)
      .join(',')}}`;
  }

  return JSON.stringify(value);
}

async function getOrCreateSeed() {
  const existing = await SecureStore.getItemAsync(SIGNING_SEED_KEY);
  if (existing) return existing;

  const generated = process.env.EXPO_PUBLIC_SIGNING_SEED || 'default-seed';
  await SecureStore.setItemAsync(SIGNING_SEED_KEY, generated);
  return generated;
}

export async function signDeployPayload(input: {
  packageName: string;
  version: string;
  payload: Record<string, unknown>;
}) {
  const seed = await getOrCreateSeed();
  const canonical = stableStringify(input);
  const material = `${seed}:${canonical}`;

  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    material
  );
}
