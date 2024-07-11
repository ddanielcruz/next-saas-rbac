import fastifyCors from '@fastify/cors';
import { fastify } from 'fastify';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';

import { createAccount } from './routes/auth/create-account';

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors, { origin: '*' });

app.register(createAccount);

app.listen({ host: '0.0.0.0', port: 3333 }).then((address) => {
  console.log(`🚀 Server listening at ${address}`);
});
