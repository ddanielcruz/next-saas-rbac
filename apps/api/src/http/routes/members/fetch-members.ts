import { Role } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { auth } from '@/http/middleware/auth';
import { prisma } from '@/lib/prisma';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { ForbiddenError } from '../_errors/forbidden-error';

export async function fetchMembers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/members',
      {
        schema: {
          tags: ['members'],
          summary: 'Fetch members',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              members: z.array(
                z.object({
                  id: z.string().cuid2(),
                  userId: z.string().cuid2(),
                  role: z.nativeEnum(Role),
                  name: z.string().nullable(),
                  email: z.string(),
                  avatarUrl: z.string().nullable(),
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params;
        const userId = await request.getCurrentUserId();
        const { membership, organization } = await request.getCurrentUserMembership(slug);
        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot('read', 'User')) {
          throw new ForbiddenError("You don't have permission to read members.");
        }

        const members = await prisma.member.findMany({
          select: {
            id: true,
            role: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
          where: {
            organizationId: organization.id,
          },
          orderBy: {
            role: 'asc',
          },
        });

        return {
          members: members.map(({ user: { id: userId, ...user }, ...member }) => ({
            ...user,
            ...member,
            userId,
          })),
        };
      },
    );
}
