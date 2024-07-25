import type { Role } from '@saas/auth';

import { api } from './api-client';

export interface GetMembersResponse {
  members: Array<{
    id: string;
    userId: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
    role: Role;
  }>;
}

export async function getMembers(org: string) {
  return await api
    .get(`organizations/${org}/members`, { next: { tags: [`${org}:members`] } })
    .json<GetMembersResponse>();
}
