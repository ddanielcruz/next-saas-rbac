import { api } from './api-client';

export interface GetOrganizationsResponse {
  organizations: Array<{
    id: string;
    name: string;
    slug: string;
    avatarUrl: string | null;
  }>;
}

export async function getOrganizations() {
  return await api
    .get('organizations', { next: { tags: ['organizations'] } })
    .json<GetOrganizationsResponse>();
}
