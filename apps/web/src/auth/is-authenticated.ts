import { cookies } from 'next/headers';

import { ACCESS_TOKEN_COOKIE } from './cookie';

export function isAuthenticated() {
  return !!cookies().get(ACCESS_TOKEN_COOKIE)?.value;
}
