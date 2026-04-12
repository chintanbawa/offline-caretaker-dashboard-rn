import { z } from 'zod';

export const commandSchema = z.object({
  type: z.literal('RESTART_MODULE'),
  payload: z.object({
    module: z.string().min(1, 'Module name is required')
  })
});

export const deploySchema = z.object({
  packageName: z.string().min(1, 'Package name is required'),
  version: z.string().min(1, 'Version is required'),
  payload: z.record(z.string(), z.unknown())
});
