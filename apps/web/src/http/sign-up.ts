import { api } from './api-client';

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export async function signUp(request: SignUpRequest): Promise<void> {
  await api.post('users', { json: request }).json();
}
