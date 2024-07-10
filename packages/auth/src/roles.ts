import { z } from 'zod';

export const roleSchema = z.enum(['admin', 'member', 'billing']);

export type Role = z.infer<typeof roleSchema>;
