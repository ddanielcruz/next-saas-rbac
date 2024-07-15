import { organizationSchema } from '@saas/auth';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { auth } from '@/http/middleware/auth';
import { prisma } from '@/lib/prisma';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { BadRequestError } from '../_errors/bad-request-error';
import { ForbiddenError } from '../_errors/forbidden-error';

export async function transferOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/organizations/:slug/owner',
      {
        schema: {
          tags: ['organizations'],
          summary: 'Transfer organization ownership',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            transferToUserId: z.string().cuid2(),
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

        if (cannot('transfer-ownership', authOrganization)) {
          throw new ForbiddenError("You don't have permission to transfer organization ownership.");
        }

        const { transferToUserId } = request.body;
        const transferToMember = await prisma.member.findUnique({
          select: { id: true },
          where: {
            organizationId_userId: {
              organizationId: organization.id,
              userId: transferToUserId,
            },
          },
        });

        if (!transferToMember) {
          throw new BadRequestError('User is not a member of this organization.');
        }

        await prisma.$transaction([
          prisma.organization.update({
            where: { id: organization.id },
            data: { ownerId: transferToUserId },
          }),
          prisma.member.update({
            where: { id: membership.id },
            data: { role: 'ADMIN' },
          }),
        ]);

        return reply.status(204).send();
      },
    );
}
