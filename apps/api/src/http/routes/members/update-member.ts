import { Role } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { auth } from '@/http/middleware/auth';
import { prisma } from '@/lib/prisma';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { ForbiddenError } from '../_errors/forbidden-error';

export async function updateMember(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug/members/:memberId',
      {
        schema: {
          tags: ['members'],
          summary: 'Update member',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            memberId: z.string().cuid2(),
          }),
          body: z.object({
            role: z.nativeEnum(Role),
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
          throw new ForbiddenError("You don't have permission to update this member.");
        }

        const { memberId } = request.params;
        const { role } = request.body;

        await prisma.member.update({
          where: { id: memberId, organizationId: organization.id },
          data: { role },
        });

        return reply.status(204).send();
      },
    );
}
