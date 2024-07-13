import { compare } from 'bcryptjs';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { prisma } from '@/lib/prisma';

export async function authenticateWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/password',
    {
      schema: {
        tags: ['auth'],
        summary: 'Authenticate with email and password',
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          201: z.object({
            accessToken: z.string(),
          }),
          401: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;
      const userFromEmail = await prisma.user.findUnique({ where: { email } });

      if (!userFromEmail) {
        return reply.status(401).send({ message: 'Invalid credentials.' });
      }

      const isPasswordValid =
        userFromEmail.passwordHash && (await compare(password, userFromEmail.passwordHash));

      if (!isPasswordValid) {
        return reply.status(401).send({ message: 'Invalid credentials.' });
      }

      const accessToken = await reply.jwtSign(
        {},
        {
          sign: {
            expiresIn: '7d',
            sub: userFromEmail.id,
          },
        },
      );

      return reply.status(201).send({ accessToken });
    },
  );
}
