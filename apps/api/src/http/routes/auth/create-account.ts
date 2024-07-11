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
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(8),
        }),
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

      const passwordHash = await hash(password, 10);

      await prisma.user.create({ data: { email, name, passwordHash } });

      return reply.status(201).send();
    },
  );
}
