import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { auth } from '@/http/middleware/auth';

export async function getOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug',
      {
        schema: {
          tags: ['organizations'],
          summary: 'Get organization details by slug',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              organization: z.object({
                id: z.string(),
                ownerId: z.string(),
                name: z.string(),
                slug: z.string(),
                domain: z.string().nullable(),
                avatarUrl: z.string().nullable(),
                shouldAttachUsersByDomain: z.boolean(),
                createdAt: z.date(),
                updatedAt: z.date().nullable(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params;
        const { organization } = await request.getCurrentUserMembership(slug);

        return {
          organization: {
            id: organization.id,
            ownerId: organization.ownerId,
            name: organization.name,
            slug: organization.slug,
            domain: organization.domain,
            avatarUrl: organization.avatarUrl,
            shouldAttachUsersByDomain: organization.shouldAttachUsersByDomain,
            createdAt: organization.createdAt,
            updatedAt: organization.updatedAt,
          },
        };
      },
    );
}
