import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { auth } from '@/http/middleware/auth';
import { prisma } from '@/lib/prisma';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { ForbiddenError } from '../_errors/forbidden-error';

export async function fetchProjects(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/projects',
      {
        schema: {
          tags: ['projects'],
          summary: 'Fetch projects',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              projects: z.array(
                z.object({
                  id: z.string(),
                  ownerId: z.string(),
                  name: z.string(),
                  description: z.string(),
                  slug: z.string(),
                  avatarUrl: z.string().nullable(),
                  createdAt: z.date(),
                  updatedAt: z.date(),
                  owner: z.object({
                    id: z.string(),
                    name: z.string().nullable(),
                    avatarUrl: z.string().nullable(),
                  }),
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

        if (cannot('read', 'Project')) {
          throw new ForbiddenError("You don't have permission to see projects.");
        }

        const projects = await prisma.project.findMany({
          select: {
            id: true,
            ownerId: true,
            name: true,
            description: true,
            slug: true,
            avatarUrl: true,
            createdAt: true,
            updatedAt: true,
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
          where: {
            organizationId: organization.id,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        return { projects };
      },
    );
}
