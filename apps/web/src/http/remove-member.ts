import { api } from './api-client';

export async function removeMember(org: string, memberId: string) {
  await api.delete(`organizations/${org}/members/${memberId}`);
}
