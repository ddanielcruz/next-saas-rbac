import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import { env } from '@saas/env';
import { fastify } from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { errorHandler } from './error-handler';
import { authenticateWithGitHub } from './routes/auth/authenticate-with-github';
import { authenticateWithPassword } from './routes/auth/authenticate-with-password';
import { createAccount } from './routes/auth/create-account';
import { getProfile } from './routes/auth/get-profile';
import { requestPasswordRecover } from './routes/auth/request-password-recover';
import { resetPassword } from './routes/auth/reset-password';
import { getOrganizationBilling } from './routes/billing/get-organization-billing';
import { acceptInvite } from './routes/invites/accept-invite';
import { createInvite } from './routes/invites/create-invite';
import { fetchInvites } from './routes/invites/fetch-invites';
import { fetchPendingInvites } from './routes/invites/fetch-pending-invites';
import { getInvite } from './routes/invites/get-invite';
import { rejectInvite } from './routes/invites/reject-invite';
import { revokeInvite } from './routes/invites/revoke-invite';
import { fetchMembers } from './routes/members/fetch-members';
import { removeMember } from './routes/members/remove-member';
import { updateMember } from './routes/members/update-member';
import { createOrganization } from './routes/orgs/create-organization';
import { getMembership } from './routes/orgs/get-membership';
import { getOrganization } from './routes/orgs/get-organization';
import { getOrganizations } from './routes/orgs/get-organizations';
import { shutdownOrganization } from './routes/orgs/shutdown-organization';
import { transferOrganization } from './routes/orgs/transfer-organization';
import { updateOrganization } from './routes/orgs/update-organization';
import { createProject } from './routes/projects/create-project';
import { deleteProject } from './routes/projects/delete-project';
import { fetchProjects } from './routes/projects/fetch-projects';
import { getProject } from './routes/projects/get-project';
import { updateProject } from './routes/projects/update-project';

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
        url: `http://${env.HOST}:${env.PORT}`,
        description: 'Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, { routePrefix: '/docs' });

app.register(fastifyJwt, { secret: env.JWT_SECRET });

app.register(fastifyCors);

app.register(createAccount);
app.register(authenticateWithPassword);
app.register(authenticateWithGitHub);
app.register(getProfile);
app.register(requestPasswordRecover);
app.register(resetPassword);
app.register(createOrganization);
app.register(getMembership);
app.register(getOrganization);
app.register(getOrganizations);
app.register(updateOrganization);
app.register(shutdownOrganization);
app.register(transferOrganization);
app.register(createProject);
app.register(deleteProject);
app.register(getProject);
app.register(fetchProjects);
app.register(updateProject);
app.register(fetchMembers);
app.register(updateMember);
app.register(removeMember);
app.register(createInvite);
app.register(getInvite);
app.register(fetchInvites);
app.register(acceptInvite);
app.register(rejectInvite);
app.register(revokeInvite);
app.register(fetchPendingInvites);
app.register(getOrganizationBilling);

app.listen({ host: env.HOST, port: env.PORT }).then((address) => {
  console.log(`🚀 Server listening at ${address}`);
});
