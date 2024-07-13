import { hash } from 'bcryptjs';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { prisma } from '@/lib/prisma';

import { UnauthorizedError } from '../_errors/unauthorized-error';

export async function resetPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/reset',
    {
      schema: {
        tags: ['auth'],
        summary: 'Request password recover',
        body: z.object({
          code: z.string(),
          password: z.string().min(8),
        }),
        response: {
          204: z.void(),
        },
      },
    },
    async (request, reply) => {
      const { code, password } = request.body;
      const token = await prisma.token.findUnique({ where: { id: code } });

      if (!token) {
        throw new UnauthorizedError();
      }

      const passwordHash = await hash(password, 10);

      await prisma.$transaction([
        prisma.token.delete({ where: { id: code } }),
        prisma.user.update({
          where: { id: token.userId },
          data: { passwordHash },
        }),
      ]);

      return reply.status(204).send();
    },
  );
}
