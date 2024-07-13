import type { FastifyInstance } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';

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
  });
});