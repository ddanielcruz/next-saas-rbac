import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { auth } from '@/http/middleware/auth';
import { prisma } from '@/lib/prisma';
import { createSlug } from '@/utils/create-slug';

import { BadRequestError } from '../_errors/bad-request-error';

export async function createOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations',
      {
        schema: {
          tags: ['organizations'],
          summary: 'Create an organization',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            domain: z.string().nullish(),
            shouldAttachUsersByDomain: z.boolean().optional(),
          }),
          response: {
            201: z.object({
              organizationId: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();
        const { name, domain, shouldAttachUsersByDomain } = request.body;

        if (domain) {
          const orgByDomain = await prisma.organization.findUnique({
            select: { id: true },
            where: { domain },
          });

          if (orgByDomain) {
            throw new BadRequestError('Organization with this domain already exists.');
          }
        }

        const org = await prisma.organization.create({
          data: {
            name,
            slug: createSlug(name),
            domain,
            shouldAttachUsersByDomain,
            ownerId: userId,
            members: {
              create: {
                userId,
                role: 'ADMIN',
              },
            },
          },
        });

        return reply.status(201).send({ organizationId: org.id });
      },
    );
}
