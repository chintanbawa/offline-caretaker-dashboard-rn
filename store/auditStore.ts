import { listAuditTrail } from '@/db/repositories/auditRepo';
import type { AuditEntry } from '@/types/domain';
import { create } from 'zustand';

type AuditState = {
  isLoading: boolean;
  entries: AuditEntry[];
  error: string | null;
  load: () => Promise<void>;
};

export const useAuditStore = create<AuditState>(set => ({
  isLoading: false,
  entries: [],
  error: null,

  load: async () => {
    set({ isLoading: true, error: null });

    try {
      const entries = await listAuditTrail();
      set({ entries, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to load audit trail',
        isLoading: false
      });
    }
  }
}));
