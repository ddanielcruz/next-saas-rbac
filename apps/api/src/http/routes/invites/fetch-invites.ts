import { Role } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { auth } from '@/http/middleware/auth';
import { prisma } from '@/lib/prisma';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { ForbiddenError } from '../_errors/forbidden-error';

export async function fetchInvites(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/invites',
      {
        schema: {
          tags: ['invites'],
          summary: 'Fetch invites',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
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
                  createdAt: z.date(),
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params;
        const userId = await request.getCurrentUserId();
        const { membership, organization } = await request.getCurrentUserMembership(slug);
        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot('read', 'Invite')) {
          throw new ForbiddenError("You don't have permission to fetch invites.");
        }

        const invites = await prisma.invite.findMany({
          where: {
            organizationId: organization.id,
          },
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
            createdAt: true,
          },
        });

        return reply.status(201).send({ invites });
      },
    );
}
