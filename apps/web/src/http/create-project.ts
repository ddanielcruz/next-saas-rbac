import { api } from './api-client';

interface CreateProjectRequest {
  org: string;
  name: string;
  description: string;
}

interface CreateProjectResponse {
  project: {
    id: string;
    slug: string;
  };
}

export async function createProject({ org, ...request }: CreateProjectRequest) {
  return await api
    .post(`organizations/${org}/projects`, { json: request })
    .json<CreateProjectResponse>();
}
