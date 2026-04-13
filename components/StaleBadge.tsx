import { StyleSheet, Text, View } from 'react-native';

type Props = {
  timestamp: string | null;
};

function getAgeMinutes(timestamp: string | null) {
  if (!timestamp) return null;
  const diffMs = Date.now() - new Date(timestamp).getTime();
  return Math.floor(diffMs / 60000);
}

export function StaleBadge({ timestamp }: Props) {
  const ageMinutes = getAgeMinutes(timestamp);

  if (ageMinutes == null) {
    return (
      <View style={styles.badge}>
        <Text style={styles.text}>Unknown freshness</Text>
      </View>
    );
  }

  const label =
    ageMinutes < 5
      ? 'Fresh'
      : ageMinutes < 60
      ? `${ageMinutes} min old`
      : `${Math.floor(ageMinutes / 60)} hr old`;

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  text: {
    fontSize: 12,
    color: '#555'
  }
});
