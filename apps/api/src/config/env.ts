import z from 'zod';

const envSchema = z.object({
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
  GITHUB_OAUTH_CLIENT_ID: z.string(),
  GITHUB_OAUTH_CLIENT_SECRET: z.string(),
  GITHUB_OAUTH_REDIRECT_URI: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
