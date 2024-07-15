import { projectSchema } from '@saas/auth';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { auth } from '@/http/middleware/auth';
import { prisma } from '@/lib/prisma';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { ForbiddenError } from '../_errors/forbidden-error';
import { NotFoundError } from '../_errors/not-found-error';

export async function updateProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:orgSlug/projects/:projectSlug',
      {
        schema: {
          tags: ['projects'],
          summary: 'Update project',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            projectSlug: z.string(),
          }),
          body: z.object({
            name: z.string(),
            description: z.string(),
          }),
          response: {
            204: z.void(),
          },
        },
      },
      async (request, reply) => {
        const { orgSlug, projectSlug } = request.params;
        const { name, description } = request.body;

        const userId = await request.getCurrentUserId();
        const { membership, organization } = await request.getCurrentUserMembership(orgSlug);
        const { cannot } = getUserPermissions(userId, membership.role);

        const project = await prisma.project.findUnique({
          where: {
            slug: projectSlug,
            organizationId: organization.id,
          },
        });

        if (!project) {
          throw new NotFoundError('Project not found.');
        }

        const authProject = projectSchema.parse(project);
        if (cannot('update', authProject)) {
          throw new ForbiddenError("You don't have permission to create a project.");
        }

        await prisma.project.update({
          where: {
            id: project.id,
          },
          data: {
            name,
            description,
          },
        });

        reply.status(204).send();
      },
    );
}
