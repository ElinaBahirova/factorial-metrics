import { z } from 'zod';

export const uuidSchema = z.string().uuid('Invalid metric id');

export const createDefinitionSchema = z.object({
  name: z.string().min(1, 'Name is required').transform((s) => s.trim()),
  description: z.string().optional().transform((s) => s?.trim() || undefined),
  measure: z.string().optional().transform((s) => s?.trim() || undefined),
});

export const createValueSchema = z.object({
  metricId: z.string().uuid('Invalid metric id'),
  value: z.number(),
  timestamp: z.string().optional(),
});

export type CreateDefinitionInput = z.infer<typeof createDefinitionSchema>;
export type CreateValueInput = z.infer<typeof createValueSchema>;
