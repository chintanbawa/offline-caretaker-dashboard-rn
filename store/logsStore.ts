import { listLogs, listLogSources } from '@/db/repositories/logsRepo';
import type { LogEntry, LogLevel } from '@/types/domain';
import { create } from 'zustand';

type LogsState = {
  isLoading: boolean;
  logs: LogEntry[];
  sources: string[];
  selectedLevel: LogLevel | 'all';
  selectedSource: string | 'all';
  error: string | null;
  load: () => Promise<void>;
  setLevel: (level: LogLevel | 'all') => void;
  setSource: (source: string | 'all') => void;
};

export const useLogsStore = create<LogsState>((set, get) => ({
  isLoading: false,
  logs: [],
  sources: [],
  selectedLevel: 'all',
  selectedSource: 'all',
  error: null,

  load: async () => {
    set({ isLoading: true, error: null });

    try {
      const { selectedLevel, selectedSource } = get();

      const [logs, sources] = await Promise.all([
        listLogs({ level: selectedLevel, source: selectedSource }),
        listLogSources()
      ]);

      set({
        logs,
        sources,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load logs',
        isLoading: false
      });
    }
  },

  setLevel: level => set({ selectedLevel: level }),
  setSource: source => set({ selectedSource: source })
}));
