import { submitDeployPackage } from '@/services/deployFlowService';
import { create } from 'zustand';

type DeployStore = {
  packageName: string;
  version: string;
  payloadText: string;
  isSubmitting: boolean;
  error: string | null;
  lastMessage: string | null;
  setPackageName: (value: string) => void;
  setVersion: (value: string) => void;
  setPayloadText: (value: string) => void;
  submit: () => Promise<void>;
};

export const useDeployStore = create<DeployStore>((set, get) => ({
  packageName: 'skill-navigation-v1',
  version: '1.0.0',
  payloadText: '{\n  "rules": ["avoid-obstacle", "low-speed-mode"]\n}',
  isSubmitting: false,
  error: null,
  lastMessage: null,

  setPackageName: value => set({ packageName: value }),
  setVersion: value => set({ version: value }),
  setPayloadText: value => set({ payloadText: value }),

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
