import { submitRestartModuleCommand } from '@/services/commandFlowService';
import { create } from 'zustand';

type CommandStore = {
  moduleName: string;
  isSubmitting: boolean;
  error: string | null;
  lastMessage: string | null;
  setModuleName: (value: string) => void;
  submit: () => Promise<void>;
};

export const useCommandStore = create<CommandStore>((set, get) => ({
  moduleName: 'Motion Control',
  isSubmitting: false,
  error: null,
  lastMessage: null,

  setModuleName: value => set({ moduleName: value }),

  submit: async () => {
    set({ isSubmitting: true, error: null, lastMessage: null });

    try {
      const result = await submitRestartModuleCommand(get().moduleName);
      set({
        isSubmitting: false,
        lastMessage: result.message
      });
    } catch (error) {
      set({
        isSubmitting: false,
        error: error instanceof Error ? error.message : 'Command submit failed'
      });
    }
  }
}));
