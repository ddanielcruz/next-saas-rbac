import { env } from '@saas/env';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { prisma } from '@/lib/prisma';

import { BadRequestError } from '../_errors/bad-request-error';

export async function authenticateWithGitHub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/github',
    {
      schema: {
        tags: ['auth'],
        summary: 'Authenticate with GitHub',
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({
            accessToken: z.string(),
          }),
        },
      },
    },
    async ({ body: { code } }, reply) => {
      // Construct the URL to fetch the access token from GitHub
      const githubOAuthUrl = new URL('https://github.com/login/oauth/access_token');
      githubOAuthUrl.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID);
      githubOAuthUrl.searchParams.set('client_secret', env.GITHUB_OAUTH_CLIENT_SECRET);
      githubOAuthUrl.searchParams.set('redirect_uri', env.GITHUB_OAUTH_REDIRECT_URI);
      githubOAuthUrl.searchParams.set('code', code);

      // Fetch the access token from GitHub
      const githubAccessTokenResponse = await fetch(githubOAuthUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      });

      const githubAccessTokenData = await githubAccessTokenResponse.json();
      const { access_token: githubAccessToken } = z
        .object({ access_token: z.string() })
        .parse(githubAccessTokenData);

      // Fetch the user data
      const githubUserResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${githubAccessToken}`,
        },
      });
      const githubUserData = await githubUserResponse.json();

      let {
        id: githubId,
        name,
        email,
        avatar_url: avatarUrl,
      } = z
        .object({
          id: z.number(),
          name: z.string().nullable(),
          email: z.string().email().nullable(),
          avatar_url: z.string().url(),
        })
        .parse(githubUserData);

      if (!email) {
        email = await getUserPrimaryEmailAddress(githubAccessToken);
      }

      if (!email) {
        throw new BadRequestError('Your GitHub account must have an email address.');
      }

      // Persist user and account
      const user = await prisma.user.upsert({
        where: { email },
        create: { email, name, avatarUrl },
        update: { name, avatarUrl },
      });

      const account = await prisma.account.findUnique({
        where: {
          provider_userId: {
            provider: 'GITHUB',
            userId: user.id,
          },
        },
      });

      if (!account) {
        await prisma.account.create({
          data: {
            provider: 'GITHUB',
            providerAccountId: githubId.toString(),
            userId: user.id,
          },
        });
      }

      const accessToken = await reply.jwtSign({}, { sign: { expiresIn: '7d', sub: user.id } });

      return reply.status(201).send({ accessToken });
    },
  );
}

async function getUserPrimaryEmailAddress(accessToken: string): Promise<string | null> {
  const githubUserEmailsResponse = await fetch('https://api.github.com/user/emails', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const githubUserEmailsData = await githubUserEmailsResponse.json();

  return (
    z
      .array(
        z.object({
          email: z.string().email(),
          primary: z.boolean(),
        }),
      )
      .parse(githubUserEmailsData)
      .find((email) => email.primary)?.email ?? null
  );
}
