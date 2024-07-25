import { api } from './api-client';

export interface GetBillingResponse {
  billing: {
    seats: {
      amount: number;
      unit: number;
      total: number;
    };
    total: number;
    projects: {
      amount: number;
      unit: number;
      total: number;
    };
  };
}

export async function getBilling(org: string) {
  return await api.get(`organizations/${org}/billing`).json<GetBillingResponse>();
}
