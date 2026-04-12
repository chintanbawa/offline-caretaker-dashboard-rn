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
  backups: {
    name: 'cloud-upload',
    nameOutline: 'cloud-upload-outline',
    label: 'Backups'
  },
  commands: {
    name: 'terminal',
    nameOutline: 'terminal-outline',
    label: 'Commands'
  },
  queue: {
    name: 'list',
    nameOutline: 'list-outline',
    label: 'Queue'
  },
  deploy: {
    name: 'paper-plane',
    nameOutline: 'paper-plane-outline',
    label: 'Deploy'
  },
  audit: {
    name: 'checkmark-circle',
    nameOutline: 'checkmark-circle-outline',
    label: 'Audit'
  },
  settings: {
    name: 'settings',
    nameOutline: 'settings-outline',
    label: 'Settings'
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
