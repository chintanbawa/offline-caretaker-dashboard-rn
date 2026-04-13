import { getSetting, saveSetting } from '@/db/repositories/settingsRepo';
import { writeAudit } from '@/services/auditService';
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

function isValidBaseUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
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

    if (!isValidBaseUrl(deviceBaseUrl)) {
      set({
        isSaving: false,
        error:
          'Enter a valid device base URL, for example http://192.168.1.10:3000'
      });
      return;
    }

    set({ isSaving: true, error: null });

    try {
      await saveSetting('device_base_url', deviceBaseUrl);

      await writeAudit({
        eventType: 'SETTINGS_SAVE',
        description: 'Saved device base URL',
        payload: { deviceBaseUrl },
        result: 'success'
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
