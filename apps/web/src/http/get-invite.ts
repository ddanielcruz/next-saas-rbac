import type { Role } from '@saas/auth';

import { api } from './api-client';

interface GetInviteResponse {
  invite: {
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
  };
}

export async function getInvite(inviteId: string) {
  return await api.get(`invites/${inviteId}`).json<GetInviteResponse>();
}
