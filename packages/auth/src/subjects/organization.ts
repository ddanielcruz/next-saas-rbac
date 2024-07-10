import { z } from 'zod';

import { organizationSchema } from '../models';

export const organizationSubjectSchema = z.tuple([
  z.enum(['manage', 'update', 'delete', 'transfer-ownership']),
  z.union([z.literal('Organization'), organizationSchema]),
]);

export type OrganizationSubject = z.infer<typeof organizationSubjectSchema>;
