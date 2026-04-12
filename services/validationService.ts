import { z } from 'zod';

export const commandSchema = z.object({
  type: z.literal('RESTART_MODULE'),
  payload: z.object({
    module: z.string().min(1, 'Module name is required')
  })
});
