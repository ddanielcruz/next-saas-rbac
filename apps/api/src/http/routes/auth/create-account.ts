import { hash } from 'bcryptjs';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        tags: ['auth'],
        summary: 'Create a new account',
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(8),
        }),
        response: {
          201: z.object({}),
          409: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, name, password } = request.body;
      const userWithSameEmail = await prisma.user.findUnique({
        select: { id: true },
        where: { email },
      });

      if (userWithSameEmail) {
        return reply.status(409).send({ message: 'Email already in use.' });
      }

      const [, domain] = email.split('@');
      const autoJoinOrg = await prisma.organization.findFirst({
        select: { id: true },
        where: {
          domain,
          shouldAttachUsersByDomain: true,
        },
      });

      const passwordHash = await hash(password, 10);

      await prisma.user.create({
        data: {
          email,
          name,
          passwordHash,
          memberOn: autoJoinOrg
            ? {
                create: {
                  organizationId: autoJoinOrg.id,
                },
              }
            : undefined,
        },
      });

      return reply.status(201).send();
    },
  );
}
