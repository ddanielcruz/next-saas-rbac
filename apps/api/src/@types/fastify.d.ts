import 'fastify';

import { Member, Organization } from '@prisma/client';

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId: () => Promise<string>;
    getCurrentUserMembership: (organizationSlug: string) => Promise<{
      organization: Organization;
      membership: Member;
    }>;
  }
}
