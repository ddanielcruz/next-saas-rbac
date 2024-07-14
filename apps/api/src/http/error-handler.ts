import type { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';

import { BadRequestError } from './routes/_errors/bad-request-error';
import { ConflictError } from './routes/_errors/conflict-error';
import { ForbiddenError } from './routes/_errors/forbidden-error';
import { UnauthorizedError } from './routes/_errors/unauthorized-error';

export const errorHandler: FastifyInstance['errorHandler'] = async (error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'ValidationError',
      message: error.flatten().fieldErrors,
    });
  }

  if (error instanceof BadRequestError) {
    return reply.status(400).send({
      statusCode: 400,
      error: error.name,
      message: error.message,
    });
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({
      statusCode: 401,
      error: error.name,
      message: error.message,
    });
  }

  if (error instanceof ConflictError) {
    return reply.status(409).send({
      statusCode: 409,
      error: error.name,
      message: error.message,
    });
  }

  if (error instanceof ForbiddenError) {
    return reply.status(403).send({
      statusCode: 403,
      error: error.name,
      message: error.message,
    });
  }

  // TODO Send error to observability service
  console.error(error);

  return reply.status(500).send({
    statusCode: 500,
    error: error.name,
    message: 'Internal server error.',
  });
};
