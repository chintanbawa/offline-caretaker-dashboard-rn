import { insertAuditEntry } from '@/db/repositories/auditRepo';
import { getSetting, saveSetting } from '@/db/repositories/settingsRepo';
import { create } from 'zustand';

type SettingsState = {
  isLoading: boolean;
  isSaving: boolean;
  deviceBaseUrl: string;
  error: string | null;
  load: () => Promise<void>;
  setDeviceBaseUrl: (value: string) => void;
  save: () => Promise<void>;
};

function createId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  isLoading: false,
  isSaving: false,
  deviceBaseUrl: '',
  error: null,

  load: async () => {
    set({ isLoading: true, error: null });

    try {
      const deviceBaseUrl = await getSetting('device_base_url');
      set({
        deviceBaseUrl: deviceBaseUrl ?? '',
        isLoading: false
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to load settings',
        isLoading: false
      });
    }
  },

  setDeviceBaseUrl: value => set({ deviceBaseUrl: value }),

  save: async () => {
    const { deviceBaseUrl } = get();

    set({ isSaving: true, error: null });

    try {
      await saveSetting('device_base_url', deviceBaseUrl);

      await insertAuditEntry({
        id: createId('audit'),
        eventType: 'SETTINGS_SAVE',
        description: 'Saved device base URL',
        payloadJson: JSON.stringify({ deviceBaseUrl }),
        result: 'success',
        createdAt: new Date().toISOString()
      });

      set({ isSaving: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to save settings',
        isSaving: false
      });
    }
  }
}));
