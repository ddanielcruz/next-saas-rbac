import { api } from './api-client';

interface CreateOrganizationRequest {
  name: string;
  domain: string | null;
  shouldAttachUsersByDomain: boolean;
}

interface CreateOrganizationResponse {
  organization: {
    id: string;
    slug: string;
  };
}

export async function createOrganization(request: CreateOrganizationRequest) {
  return await api.post('organizations', { json: request }).json<CreateOrganizationResponse>();
}
