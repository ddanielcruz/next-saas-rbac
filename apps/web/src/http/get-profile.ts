import { api } from './api-client';

export interface GetProfileResponse {
  user: {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
  };
}

export async function getProfile() {
  return await api.get('profile').json<GetProfileResponse>();
}
