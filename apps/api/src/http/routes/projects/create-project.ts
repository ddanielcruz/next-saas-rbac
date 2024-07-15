import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { auth } from '@/http/middleware/auth';
import { prisma } from '@/lib/prisma';
import { createSlug } from '@/utils/create-slug';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { ForbiddenError } from '../_errors/forbidden-error';

export async function createProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/projects',
      {
        schema: {
          tags: ['projects'],
          summary: 'Create project',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            name: z.string(),
            description: z.string(),
          }),
          response: {
            201: z.object({
              project: z.object({
                id: z.string(),
                slug: z.string(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params;
        const { name, description } = request.body;

        const userId = await request.getCurrentUserId();
        const { membership, organization } = await request.getCurrentUserMembership(slug);
        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot('create', 'Project')) {
          throw new ForbiddenError("You don't have permission to create a project.");
        }

        const project = await prisma.project.create({
          data: {
            ownerId: userId,
            name,
            description,
            slug: createSlug(name),
            organizationId: organization.id,
          },
        });

        return reply.status(201).send({
          project: {
            id: project.id,
            slug: project.slug,
          },
        });
      },
    );
}
