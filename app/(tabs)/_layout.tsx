import {
    getTabIconName,
    getTabLabel,
    type TabIconKey
} from '@/constants/tabIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

const TAB_ICON_SIZE = 24;

const getTabBarIcon = (tab: TabIconKey) => 
  ({ color, focused }: { color: string; focused: boolean }) => (
    <Ionicons
      name={getTabIconName(tab, focused) as any}
      size={TAB_ICON_SIZE}
      color={color}
    />
  );

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name='index'
        options={{
          title: getTabLabel('dashboard'),
          tabBarIcon: getTabBarIcon('dashboard'),
        }}
      />
      <Tabs.Screen
        name='logs'
        options={{
          title: getTabLabel('logs'),
          tabBarIcon: getTabBarIcon('logs'),
        }}
      />
      <Tabs.Screen
        name='audit'
        options={{
          title: getTabLabel('audit'),
          tabBarIcon: getTabBarIcon('audit'),
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          title: getTabLabel('settings'),
          tabBarIcon: getTabBarIcon('settings'),
        }}
      />
    </Tabs>
  );
}
