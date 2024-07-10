import { z } from 'zod';

export const billingSubjectSchema = z.tuple([
  z.enum(['manage', 'create', 'read', 'export']),
  z.literal('Billing'),
]);

export type BillingSubject = z.infer<typeof billingSubjectSchema>;
