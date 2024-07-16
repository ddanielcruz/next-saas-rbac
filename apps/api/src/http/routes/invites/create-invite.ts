import { Role } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { auth } from '@/http/middleware/auth';
import { prisma } from '@/lib/prisma';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { BadRequestError } from '../_errors/bad-request-error';
import { ConflictError } from '../_errors/conflict-error';
import { ForbiddenError } from '../_errors/forbidden-error';

export async function createInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/invites',
      {
        schema: {
          tags: ['invites'],
          summary: 'Create invite',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            email: z.string().email(),
            role: z.nativeEnum(Role).default('MEMBER'),
          }),
          response: {
            201: z.object({
              invite: z.object({
                id: z.string().cuid2(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params;
        const userId = await request.getCurrentUserId();
        const { membership, organization } = await request.getCurrentUserMembership(slug);
        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot('create', 'Invite')) {
          throw new ForbiddenError("You don't have permission to send an invite.");
        }

        const { email, role } = request.body;
        const [, domain] = email.split('@');

        if (organization.shouldAttachUsersByDomain && organization.domain === domain) {
          throw new BadRequestError(
            `Users with "${domain}" domain will be automatically attached to the organization on login.`,
          );
        }

        const inviteWithSameEmail = await prisma.invite.findUnique({
          select: { id: true },
          where: {
            organizationId_email: {
              organizationId: organization.id,
              email,
            },
          },
        });

        if (inviteWithSameEmail) {
          throw new ConflictError('An invite with this email already exists.');
        }

        const memberWithSameEmail = await prisma.member.findFirst({
          select: { id: true },
          where: {
            organizationId: organization.id,
            user: {
              email,
            },
          },
        });

        if (memberWithSameEmail) {
          throw new ConflictError('A member with this email already exists.');
        }

        const invite = await prisma.invite.create({
          select: { id: true },
          data: {
            authorId: userId,
            email,
            organizationId: organization.id,
            role,
          },
        });

        return reply.status(201).send({ invite });
      },
    );
}
