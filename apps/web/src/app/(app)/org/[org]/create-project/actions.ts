'use server';

import { HTTPError } from 'ky';
import { z } from 'zod';

import { getCurrentOrg } from '@/auth';
import type { FormState } from '@/hooks/use-form-state';
import { createProject } from '@/http/create-project';

const createProjectSchema = z.object({
  name: z.string().trim().min(4, { message: 'Project name must be at least 4 characters long.' }),
  description: z.string().trim().min(1, { message: 'Description is required.' }),
});

export async function createProjectAction(data: FormData): Promise<FormState> {
  const result = createProjectSchema.safeParse(Object.fromEntries(data));
  if (!result.success) {
    return {
      success: false,
      message: null,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    await createProject({ org: getCurrentOrg()!, ...result.data });
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
    message: 'Project created successfully.',
    errors: null,
  };
}
