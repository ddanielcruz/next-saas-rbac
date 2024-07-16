import { z } from 'zod';

export const inviteSubjectSchema = z.tuple([
  z.enum(['manage', 'create', 'read', 'update', 'delete']),
  z.literal('Invite'),
]);

export type InviteSubject = z.infer<typeof inviteSubjectSchema>;
