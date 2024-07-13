import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import { fastify } from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { errorHandler } from './error-handler';
import { authenticateWithPassword } from './routes/auth/authenticate-with-password';
import { createAccount } from './routes/auth/create-account';
import { getProfile } from './routes/auth/get-profile';
import { requestPasswordRecover } from './routes/auth/request-password-recover';
import { resetPassword } from './routes/auth/reset-password';

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);
app.setErrorHandler(errorHandler);

app.register(fastifySwagger, {
  openapi: {
    openapi: '3.1.0',
    info: {
      title: 'Next.js RBAC Saas',
      description: 'Fullstack RBAC Saas with Next.js, Prisma, and Fastify',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Development server',
      },
    ],
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, { routePrefix: '/docs' });

app.register(fastifyCors, { origin: '*' });
app.register(fastifyJwt, { secret: 'my-jwt-secret' });

app.register(createAccount);
app.register(authenticateWithPassword);
app.register(getProfile);
app.register(requestPasswordRecover);
app.register(resetPassword);

app.listen({ host: '0.0.0.0', port: 3333 }).then((address) => {
  console.log(`🚀 Server listening at ${address}`);
});
