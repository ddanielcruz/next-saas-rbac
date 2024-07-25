import { api } from './api-client';

export interface GetOrganizationResponse {
  organization: {
    id: string;
    name: string;
    ownerId: string;
    slug: string;
    domain: string | null;
    shouldAttachUsersByDomain: boolean;
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string | null;
  };
}

export async function getOrganization(org: string) {
  return await api.get(`organizations/${org}`).json<GetOrganizationResponse>();
}
