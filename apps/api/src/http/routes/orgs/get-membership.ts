import { Role } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { auth } from '@/http/middleware/auth';

export async function getMembership(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/membership',
      {
        schema: {
          tags: ['organizations'],
          summary: 'Get organization membership',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              membership: z.object({
                id: z.string(),
                userId: z.string(),
                organizationId: z.string(),
                role: z.nativeEnum(Role),
                createdAt: z.date(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params;
        const { membership } = await request.getCurrentUserMembership(slug);

        return {
          membership: {
            id: membership.id,
            userId: membership.userId,
            organizationId: membership.organizationId,
            role: membership.role,
            createdAt: membership.createdAt,
          },
        };
      },
    );
}
