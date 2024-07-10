import { z } from 'zod';

export const userSubjectSchema = z.tuple([
  z.enum(['manage', 'read', 'update', 'delete']),
  z.literal('User'),
]);

export type UserSubject = z.infer<typeof userSubjectSchema>;
