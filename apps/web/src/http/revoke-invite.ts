import { api } from './api-client';

export async function revokeInvite(org: string, inviteId: string) {
  await api.delete(`organizations/${org}/invites/${inviteId}`);
}
