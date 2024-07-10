import { z } from 'zod';

import { projectSchema } from '../models';

export const projectSubjectSchema = z.tuple([
  z.enum(['manage', 'create', 'read', 'update', 'delete']),
  z.union([z.literal('Project'), projectSchema]),
]);

export type ProjectSubject = z.infer<typeof projectSubjectSchema>;
