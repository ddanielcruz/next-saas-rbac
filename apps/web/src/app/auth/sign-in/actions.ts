'use server';

import { HTTPError } from 'ky';
import { cookies } from 'next/headers';
import { z } from 'zod';

import { ACCESS_TOKEN_COOKIE } from '@/auth/cookie';
import type { FormState } from '@/hooks/use-form-state';
import { acceptInvite } from '@/http/accept-invite';
import { signInWithPassword } from '@/http/sign-in-with-password';

const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export async function signInWithEmailAndPassword(data: FormData): Promise<FormState> {
  const result = signInSchema.safeParse(Object.fromEntries(data));
  if (!result.success) {
    return {
      success: false,
      message: null,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const { accessToken } = await signInWithPassword(result.data);
    cookies().set(ACCESS_TOKEN_COOKIE, accessToken, {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    const inviteId = cookies().get('inviteId')?.value;
    if (inviteId) {
      try {
        await acceptInvite(inviteId);
        cookies().delete('inviteId');
      } catch (error) {}
    }
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
