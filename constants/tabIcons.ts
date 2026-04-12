export const TAB_ICONS = {
  dashboard: {
    name: 'stats-chart',
    nameOutline: 'stats-chart-outline',
    label: 'Dashboard'
  },
  logs: {
    name: 'document-text',
    nameOutline: 'document-text-outline',
    label: 'Logs'
  },
  queue: {
    name: 'list',
    nameOutline: 'list-outline',
    label: 'Queue'
  },
  audit: {
    name: 'checkmark-circle',
    nameOutline: 'checkmark-circle-outline',
    label: 'Audit'
  },
  more: {
    name: 'ellipsis-horizontal',
    nameOutline: 'ellipsis-horizontal-outline',
    label: 'More'
  }
} as const;

export type TabIconKey = keyof typeof TAB_ICONS;

export const getTabIconName = (tab: TabIconKey, focused: boolean): any => {
  const icon = TAB_ICONS[tab];
  return focused ? icon.name : icon.nameOutline;
};

export const getTabLabel = (tab: TabIconKey): string => {
  return TAB_ICONS[tab].label;
};
