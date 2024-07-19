import { api } from './api-client';

export interface SignInWithPasswordRequest {
  email: string;
  password: string;
}

export interface SignInWithPasswordResponse {
  accessToken: string;
}

export async function signInWithPassword(
  request: SignInWithPasswordRequest,
): Promise<SignInWithPasswordResponse> {
  return await api.post('sessions/password', { json: request }).json<SignInWithPasswordResponse>();
}
