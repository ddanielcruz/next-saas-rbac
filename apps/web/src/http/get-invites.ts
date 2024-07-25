import type { Role } from '@saas/auth';

import { api } from './api-client';

export interface GetInvitesResponse {
  invites: Array<{
    id: string;
    role: Role;
    email: string;
    author: {
      id: string;
      name: string | null;
      avatarUrl: string | null;
    } | null;
    createdAt: string;
  }>;
}

export async function getInvites(org: string) {
  return await api
    .get(`organizations/${org}/invites`, { next: { tags: [`${org}:invites`] } })
    .json<GetInvitesResponse>();
}
