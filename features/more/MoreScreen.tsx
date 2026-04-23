import { Screen } from '@/components/Screen';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const items = [
  {
    href: '/backups',
    label: 'Backups',
    description: 'View local backup ledger'
  },
  {
    href: '/commands',
    label: 'Commands',
    description: 'Queue and send device commands'
  },
  {
    href: '/deploy',
    label: 'Deploy',
    description: 'Import, sign, queue, and deploy packages'
  },
  {
    href: '/ble',
    label: 'BLE Discovery',
    description: 'Discover nearby edge devices over Bluetooth LE'
  },
  {
    href: '/settings',
    label: 'Settings',
    description: 'Manage local device connection settings'
  }
] as const;

export function MoreScreen() {
  return (
    <Screen title='More' subtitle='Secondary tools and configuration'>
      <View style={styles.list}>
        {items.map(item => (
          <Link key={item.href} href={item.href} asChild>
            <Pressable style={styles.card}>
              <Text style={styles.title}>{item.label}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    gap: 4
  },
  title: {
    fontWeight: '700',
    fontSize: 16
  },
  description: {
    color: '#666'
  }
});
