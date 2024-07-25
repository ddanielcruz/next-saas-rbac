import type { Role } from '@saas/auth';

import { api } from './api-client';

interface CreateInviteRequest {
  org: string;
  email: string;
  role: Role;
}

interface CreateInviteResponse {
  invite: {
    id: string;
  };
}

export async function createInvite({ org, ...request }: CreateInviteRequest) {
  return await api
    .post(`organizations/${org}/invites`, { json: request })
    .json<CreateInviteResponse>();
}
