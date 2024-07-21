import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

import { ACCESS_TOKEN_COOKIE } from '@/auth/cookie';

export async function GET(request: NextRequest) {
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = '/auth/sign-in';

  cookies().delete(ACCESS_TOKEN_COOKIE);

  return NextResponse.redirect(redirectUrl);
}
