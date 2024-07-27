import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

import { ACCESS_TOKEN_COOKIE } from '@/auth/cookie';
import { acceptInvite } from '@/http/accept-invite';
import { signInWithGitHub } from '@/http/sign-in-with-github';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ message: 'GitHub OAuth code not found.' }, { status: 400 });
  }

  const { accessToken } = await signInWithGitHub({ code });
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

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = '/';
  redirectUrl.search = '';

  return NextResponse.redirect(redirectUrl);
}
