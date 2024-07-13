import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { prisma } from '@/lib/prisma';

export async function requestPasswordRecover(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/recover',
    {
      schema: {
        tags: ['auth'],
        summary: 'Request password recover',
        body: z.object({
          email: z.string().email(),
        }),
        response: {
          201: z.void(),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body;
      const userFromEmail = await prisma.user.findUnique({ where: { email } });

      if (!userFromEmail) {
        // We don't want people to know if an email is registered or not
        return reply.status(201).send();
      }

      // TODO Send email with token
      const token = await prisma.token.create({
        data: {
          type: 'PASSWORD_RECOVERY',
          userId: userFromEmail.id,
        },
      });
      console.debug('Password recovery token:', token);

      return reply.status(201).send();
    },
  );
}
