import { submitDeployPackage } from '@/services/deployFlowService';
import { importJsonPackageFile } from '@/services/packageImportService';
import { create } from 'zustand';

type DeployStore = {
  packageName: string;
  version: string;
  payloadText: string;
  isSubmitting: boolean;
  isImporting: boolean;
  error: string | null;
  lastMessage: string | null;
  setPackageName: (value: string) => void;
  setVersion: (value: string) => void;
  setPayloadText: (value: string) => void;
  importPayloadFile: () => Promise<void>;
  submit: () => Promise<void>;
};

export const useDeployStore = create<DeployStore>((set, get) => ({
  packageName: 'skill-navigation-v1',
  version: '1.0.0',
  payloadText: '{\n  "rules": ["avoid-obstacle", "low-speed-mode"]\n}',
  isSubmitting: false,
  isImporting: false,
  error: null,
  lastMessage: null,

  setPackageName: value => set({ packageName: value }),
  setVersion: value => set({ version: value }),
  setPayloadText: value => set({ payloadText: value }),

  importPayloadFile: async () => {
    set({ isImporting: true, error: null, lastMessage: null });

    try {
      const result = await importJsonPackageFile();
      set({
        payloadText: JSON.stringify(result.parsed, null, 2),
        isImporting: false,
        lastMessage: 'Imported JSON package file'
      });
    } catch (error) {
      set({
        isImporting: false,
        error: error instanceof Error ? error.message : 'Import failed'
      });
    }
  },

  submit: async () => {
    set({ isSubmitting: true, error: null, lastMessage: null });

    try {
      const payload = JSON.parse(get().payloadText) as Record<string, unknown>;

      const result = await submitDeployPackage({
        packageName: get().packageName,
        version: get().version,
        payload
      });

      set({
        isSubmitting: false,
        lastMessage: result.message
      });
    } catch (error) {
      set({
        isSubmitting: false,
        error: error instanceof Error ? error.message : 'Deploy failed'
      });
    }
  }
}));
