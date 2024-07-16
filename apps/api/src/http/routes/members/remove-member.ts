import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { auth } from '@/http/middleware/auth';
import { prisma } from '@/lib/prisma';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { ForbiddenError } from '../_errors/forbidden-error';

export async function removeMember(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug/members/:memberId',
      {
        schema: {
          tags: ['members'],
          summary: 'Remove member',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            memberId: z.string().cuid2(),
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
        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot('update', 'User')) {
          throw new ForbiddenError("You don't have permission to remove this member.");
        }

        const { memberId } = request.params;
        await prisma.member.delete({
          where: {
            id: memberId,
            organizationId: organization.id,
          },
        });

        return reply.status(204).send();
      },
    );
}
