import { listBackups } from '@/db/repositories/backupsRepo';
import type { BackupEntry } from '@/types/domain';
import { create } from 'zustand';

type BackupsState = {
  isLoading: boolean;
  backups: BackupEntry[];
  error: string | null;
  load: () => Promise<void>;
};

export const useBackupsStore = create<BackupsState>(set => ({
  isLoading: false,
  backups: [],
  error: null,

  load: async () => {
    set({ isLoading: true, error: null });

    try {
      const backups = await listBackups();
      set({ backups, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to load backups',
        isLoading: false
      });
    }
  }
}));
