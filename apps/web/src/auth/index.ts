import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { getProfile } from '@/http/get-profile';

import { ACCESS_TOKEN_COOKIE } from './cookie';

export async function auth() {
  const accessToken = cookies().get(ACCESS_TOKEN_COOKIE)?.value;

  if (accessToken) {
    try {
      return await getProfile();
    } catch {
      // If the access token is invalid, redirect to sign out route
    }
  }

  redirect('/api/auth/sign-out');
}

export function isAuthenticated() {
  return !!cookies().get(ACCESS_TOKEN_COOKIE)?.value;
}

export function getCurrentOrg() {
  return cookies().get('org')?.value ?? null;
}
