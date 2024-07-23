import { api } from './api-client';

export interface GetProjectsResponse {
  projects: Array<{
    id: string;
    ownerId: string;
    name: string;
    slug: string;
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
    description: string;
    owner: {
      name: string | null;
      id: string;
      avatarUrl: string | null;
    };
  }>;
}

export async function getProjects(org: string) {
  return await api.get(`organizations/${org}/projects`).json<GetProjectsResponse>();
}
