import { api } from './api-client';

interface UpdateMemberRequest {
  org: string;
  memberId: string;
  role: string;
}

export async function updateMember({ org, memberId, ...request }: UpdateMemberRequest) {
  await api.put(`organizations/${org}/members/${memberId}`, { json: request });
}
