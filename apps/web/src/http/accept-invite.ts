import { api } from './api-client';

export async function acceptInvite(inviteId: string) {
  return await api.post(`invites/${inviteId}/accept`);
}
