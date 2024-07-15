import { organizationSchema } from '@saas/auth';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { auth } from '@/http/middleware/auth';
import { prisma } from '@/lib/prisma';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { ForbiddenError } from '../_errors/forbidden-error';

export async function shutdownOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug',
      {
        schema: {
          tags: ['organizations'],
          summary: 'Shutdown organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.void(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params;
        const userId = await request.getCurrentUserId();
        const { membership, organization } = await request.getCurrentUserMembership(slug);

        const authOrganization = organizationSchema.parse(organization);
        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot('delete', authOrganization)) {
          throw new ForbiddenError("You don't have permission to shutdown this organization.");
        }

        await prisma.$transaction([
          prisma.member.deleteMany({ where: { organizationId: organization.id } }),
          prisma.organization.delete({ where: { id: organization.id } }),
        ]);

        return reply.status(204).send();
      },
    );
}
