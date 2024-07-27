import { Role } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { auth } from '@/http/middleware/auth';
import { prisma } from '@/lib/prisma';

export async function fetchPendingInvites(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/invites/pending',
      {
        schema: {
          tags: ['invites'],
          summary: 'Fetch pending invites',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              invites: z.array(
                z.object({
                  id: z.string().cuid2(),
                  email: z.string().email(),
                  role: z.nativeEnum(Role),
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
                  createdAt: z.date(),
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const userId = await request.getCurrentUserId();

        const { email } = await prisma.user.findUniqueOrThrow({
          select: { email: true },
          where: { id: userId },
        });

        const invites = await prisma.invite.findMany({
          where: { email },
          select: {
            id: true,
            email: true,
            role: true,
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
            createdAt: true,
          },
        });

        return { invites };
      },
    );
}
