import { organizationSchema } from '@saas/auth';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { auth } from '@/http/middleware/auth';
import { prisma } from '@/lib/prisma';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { BadRequestError } from '../_errors/bad-request-error';
import { ForbiddenError } from '../_errors/forbidden-error';

export async function updateOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug',
      {
        schema: {
          tags: ['organizations'],
          summary: 'Update organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            name: z.string(),
            domain: z.string().nullish(),
            shouldAttachUsersByDomain: z.boolean().optional(),
          }),
          response: {
            204: z.void(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params;
        const { name, domain, shouldAttachUsersByDomain } = request.body;

        const userId = await request.getCurrentUserId();
        const { membership, organization } = await request.getCurrentUserMembership(slug);

        const authOrganization = organizationSchema.parse(organization);
        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot('update', authOrganization)) {
          throw new ForbiddenError("You don't have permission to update this organization.");
        }

        if (domain) {
          const orgByDomain = await prisma.organization.findUnique({
            select: { id: true },
            where: { domain, AND: { id: { not: organization.id } } },
          });

          if (orgByDomain) {
            throw new BadRequestError('Organization with this domain already exists.');
          }
        }

        await prisma.organization.update({
          where: { id: organization.id },
          data: {
            name,
            domain,
            shouldAttachUsersByDomain,
          },
        });

        return reply.status(204).send();
      },
    );
}
