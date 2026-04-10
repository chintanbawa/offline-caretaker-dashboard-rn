import { StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
  value: string;
};

export function StatTile({ label, value }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    gap: 6
  },
  label: {
    fontSize: 13,
    color: '#666'
  },
  value: {
    fontSize: 20,
    fontWeight: '700'
  }
});
