'use server';

import { redirect } from 'next/navigation';

export async function signInWithGitHub() {
  const githubSignInUrl = new URL('login/oauth/authorize', 'https://github.com');

  githubSignInUrl.searchParams.append('client_id', '495379ea2aafa0499d82');
  githubSignInUrl.searchParams.append('redirect_uri', 'http://localhost:3000/api/auth/callback');
  githubSignInUrl.searchParams.append('scope', 'user');

  redirect(githubSignInUrl.toString());
}
