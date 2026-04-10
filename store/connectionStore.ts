import { getSetting } from '@/db/repositories/settingsRepo';
import {
  syncDeviceSnapshot,
  testDeviceConnection
} from '@/services/syncService';
import { create } from 'zustand';

type ConnectionStore = {
  isTesting: boolean;
  isSyncing: boolean;
  lastConnectionOk: boolean | null;
  lastMessage: string | null;
  testConnection: () => Promise<void>;
  syncNow: () => Promise<void>;
};

export const useConnectionStore = create<ConnectionStore>(set => ({
  isTesting: false,
  isSyncing: false,
  lastConnectionOk: null,
  lastMessage: null,

  testConnection: async () => {
    set({ isTesting: true, lastMessage: null });

    try {
      const baseUrl = await getSetting('device_base_url');

      if (!baseUrl) {
        throw new Error('Device base URL is empty');
      }

      await testDeviceConnection(baseUrl);

      set({
        isTesting: false,
        lastConnectionOk: true,
        lastMessage: 'Connection successful'
      });
    } catch (error) {
      set({
        isTesting: false,
        lastConnectionOk: false,
        lastMessage:
          error instanceof Error ? error.message : 'Connection failed'
      });
    }
  },

  syncNow: async () => {
    set({ isSyncing: true, lastMessage: null });

    try {
      const baseUrl = await getSetting('device_base_url');

      if (!baseUrl) {
        throw new Error('Device base URL is empty');
      }

      await syncDeviceSnapshot(baseUrl);

      set({
        isSyncing: false,
        lastConnectionOk: true,
        lastMessage: 'Sync completed'
      });
    } catch (error) {
      set({
        isSyncing: false,
        lastConnectionOk: false,
        lastMessage: error instanceof Error ? error.message : 'Sync failed'
      });
    }
  }
}));
