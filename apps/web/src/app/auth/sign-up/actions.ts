'use server';

import { HTTPError } from 'ky';
import { z } from 'zod';

import type { FormState } from '@/hooks/use-form-state';
import { signUp } from '@/http/sign-up';

const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Name is required.' })
      .trim()
      .refine((value) => value.split(' ').length > 1, {
        message: 'Please provide your full name.',
      }),
    email: z.string().email({ message: 'Invalid email address.' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match.',
    path: ['passwordConfirmation'],
  });

export async function signUpAction(data: FormData): Promise<FormState> {
  const result = signUpSchema.safeParse(Object.fromEntries(data));
  if (!result.success) {
    return {
      success: false,
      message: null,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    await signUp(result.data);
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
    message: null,
    errors: null,
  };
}
