import type { Role } from '@saas/auth';

import { api } from './api-client';

export interface GetPendingInvitesResponse {
  invites: Array<{
    id: string;
    role: Role;
    email: string;
    author: {
      id: string;
      name: string | null;
      avatarUrl: string | null;
    } | null;
    organization: {
      id: string;
      name: string | null;
      avatarUrl: string | null;
    };
    createdAt: string;
  }>;
}

export async function getPendingInvites() {
  return await api.get('invites/pending').json<GetPendingInvitesResponse>();
}
