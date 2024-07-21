import { getCookie } from 'cookies-next';
import type { CookiesFn } from 'cookies-next/lib/types';
import ky from 'ky';

import { ACCESS_TOKEN_COOKIE } from '@/auth/auth';

export const api = ky.create({
  prefixUrl: 'http://localhost:3333',
  hooks: {
    beforeRequest: [
      async (request) => {
        let cookieStore: CookiesFn | undefined;

        if (typeof window === 'undefined') {
          const { cookies } = await import('next/headers');
          cookieStore = cookies;
        }

        const accessToken = getCookie(ACCESS_TOKEN_COOKIE, { cookies: cookieStore });

        if (accessToken) {
          request.headers.set('Authorization', `Bearer ${accessToken}`);
        }
      },
    ],
  },
});
