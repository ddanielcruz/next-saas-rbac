import type { Role } from '@saas/auth';

import { api } from './api-client';

export interface GetMembershipResponse {
  membership: {
    id: string;
    userId: string;
    organizationId: string;
    role: Role;
    createdAt: string;
  };
}

export async function getMembership(org: string) {
  return await api.get(`organizations/${org}/membership`).json<GetMembershipResponse>();
}
