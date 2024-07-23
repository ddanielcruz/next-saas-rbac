'use server';

import { HTTPError } from 'ky';
import { z } from 'zod';

import type { FormState } from '@/hooks/use-form-state';
import { createOrganization } from '@/http/create-organization';

const createOrganizationSchema = z
  .object({
    name: z.string().min(4, { message: 'Organization name must be at least 4 characters long.' }),
    domain: z
      .string()
      .trim()
      .nullable()
      .refine(
        (value) => {
          if (value) {
            const domainRegex = /^[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
            return domainRegex.test(value);
          }

          return true;
        },
        { message: 'Invalid domain name.' },
      ),
    shouldAttachUsersByDomain: z
      .union([z.literal('on'), z.literal('off'), z.boolean()])
      .transform((value) => value === true || value === 'on')
      .default(false),
  })
  .refine((data) => !data.shouldAttachUsersByDomain || data.domain, {
    message: 'Domain name is required when attaching users by domain.',
    path: ['domain'],
  });

export async function createOrganizationAction(data: FormData): Promise<FormState> {
  const result = createOrganizationSchema.safeParse(Object.fromEntries(data));
  if (!result.success) {
    return {
      success: false,
      message: null,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    await createOrganization(result.data);
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = (await error.response.json()) as { message: string };
      return {
        success: false,
        message,
        errors: null,
      };
    }

    console.error(error);

    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      errors: null,
    };
  }

  return {
    success: true,
    message: 'Organization created successfully.',
    errors: null,
  };
}
