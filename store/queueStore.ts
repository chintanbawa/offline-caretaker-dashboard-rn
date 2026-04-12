import type { QueuedAction } from '@/db/repositories/actionsRepo';
import { listRecentQueuedActions } from '@/db/repositories/actionsRepo';
import { processPendingQueue } from '@/services/queueService';
import { create } from 'zustand';

type QueueStore = {
  items: QueuedAction[];
  isLoading: boolean;
  isProcessing: boolean;
  error: string | null;
  load: () => Promise<void>;
  retryPending: () => Promise<void>;
};

export const useQueueStore = create<QueueStore>(set => ({
  items: [],
  isLoading: false,
  isProcessing: false,
  error: null,

  load: async () => {
    set({ isLoading: true, error: null });

    try {
      const items = await listRecentQueuedActions();
      set({ items, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load queue'
      });
    }
  },

  retryPending: async () => {
    set({ isProcessing: true, error: null });

    try {
      await processPendingQueue();
      const items = await listRecentQueuedActions();
      set({ items, isProcessing: false });
    } catch (error) {
      set({
        isProcessing: false,
        error: error instanceof Error ? error.message : 'Retry failed'
      });
    }
  }
}));
