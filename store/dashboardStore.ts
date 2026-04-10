import {
  getLatestDeviceStatus,
  listModuleStatuses
} from '@/db/repositories/deviceRepo';
import type { DeviceStatus, ModuleStatus } from '@/types/domain';
import { create } from 'zustand';

type DashboardState = {
  isLoading: boolean;
  deviceStatus: DeviceStatus | null;
  modules: ModuleStatus[];
  error: string | null;
  load: () => Promise<void>;
};

export const useDashboardStore = create<DashboardState>(set => ({
  isLoading: false,
  deviceStatus: null,
  modules: [],
  error: null,

  load: async () => {
    set({ isLoading: true, error: null });

    try {
      const [deviceStatus, modules] = await Promise.all([
        getLatestDeviceStatus(),
        listModuleStatuses()
      ]);

      set({
        deviceStatus,
        modules,
        isLoading: false
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to load dashboard',
        isLoading: false
      });
    }
  }
}));
