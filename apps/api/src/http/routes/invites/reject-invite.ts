import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { auth } from '@/http/middleware/auth';
import { prisma } from '@/lib/prisma';

import { NotFoundError } from '../_errors/not-found-error';

export async function rejectInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/invites/:inviteId/reject',
      {
        schema: {
          tags: ['invites'],
          summary: 'Reject invite',
          security: [{ bearerAuth: [] }],
          params: z.object({
            inviteId: z.string().cuid2(),
          }),
          response: {
            204: z.void(),
          },
        },
      },
      async (request, reply) => {
        const { inviteId } = request.params;
        const invite = await prisma.invite.findUnique({ where: { id: inviteId } });

        if (!invite) {
          throw new NotFoundError('Invite not found.');
        }

        const userId = await request.getCurrentUserId();
        const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

        if (invite.email !== user.email) {
          throw new NotFoundError('Invite not found.');
        }

        await prisma.invite.delete({ where: { id: inviteId } });

        return reply.status(204).send();
      },
    );
}
