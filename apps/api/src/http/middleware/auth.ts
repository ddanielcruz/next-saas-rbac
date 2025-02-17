import type { FastifyInstance } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';

import { prisma } from '@/lib/prisma';

import { ForbiddenError } from '../routes/_errors/forbidden-error';
import { UnauthorizedError } from '../routes/_errors/unauthorized-error';

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    request.getCurrentUserId = async () => {
      try {
        const payload = await request.jwtVerify<{ sub: string }>();
        return payload.sub;
      } catch {
        throw new UnauthorizedError();
      }
    };

    request.getCurrentUserMembership = async (organizationSlug: string) => {
      const userId = await request.getCurrentUserId();
      const member = await prisma.member.findFirst({
        where: {
          userId,
          organization: {
            slug: organizationSlug,
          },
        },
        include: {
          organization: true,
        },
      });

      if (!member) {
        throw new ForbiddenError("You're not a member of this organization.");
      }

      const { organization, ...membership } = member;

      return { organization, membership };
    };
  });
});
