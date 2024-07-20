import { api } from './api-client';

export interface SignInWithGitHubRequest {
  code: string;
}

export interface SignInWithGitHubResponse {
  accessToken: string;
}

export async function signInWithGitHub(
  request: SignInWithGitHubRequest,
): Promise<SignInWithGitHubResponse> {
  return await api.post('sessions/github', { json: request }).json<SignInWithGitHubResponse>();
}
