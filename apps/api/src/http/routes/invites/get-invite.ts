import { Role } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { auth } from '@/http/middleware/auth';
import { prisma } from '@/lib/prisma';

import { NotFoundError } from '../_errors/not-found-error';

export async function getInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/invites/:inviteId',
      {
        schema: {
          tags: ['invites'],
          summary: 'Get invite',
          security: [{ bearerAuth: [] }],
          params: z.object({
            inviteId: z.string().cuid2(),
          }),
          response: {
            200: z.object({
              invite: z.object({
                id: z.string().cuid2(),
                email: z.string().email(),
                role: z.nativeEnum(Role),
                createdAt: z.date(),
                author: z
                  .object({
                    id: z.string().cuid2(),
                    name: z.string().nullish(),
                    avatarUrl: z.string().url().nullish(),
                  })
                  .nullish(),
                organization: z.object({
                  id: z.string().cuid2(),
                  name: z.string(),
                  avatarUrl: z.string().url().nullish(),
                }),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { inviteId } = request.params;
        const invite = await prisma.invite.findUnique({
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
            organization: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
          where: { id: inviteId },
        });

        if (!invite) {
          throw new NotFoundError('Invite not found.');
        }

        return reply.status(201).send({ invite });
      },
    );
}
