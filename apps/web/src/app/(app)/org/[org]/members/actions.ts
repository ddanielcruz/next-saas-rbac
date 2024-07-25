'use server';

import type { Role } from '@saas/auth';
import { roleSchema } from '@saas/auth/src/roles';
import { HTTPError } from 'ky';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';

import { getCurrentOrg } from '@/auth';
import type { FormState } from '@/hooks/use-form-state';
import { createInvite } from '@/http/create-invite';
import { removeMember } from '@/http/remove-member';
import { revokeInvite } from '@/http/revoke-invite';
import { updateMember } from '@/http/update-member';

export async function removeMemberAction(memberId: string) {
  const org = getCurrentOrg()!;
  await removeMember(org, memberId);

  revalidateTag(`${org}:members`);
}

export async function updateMemberAction(memberId: string, role: Role) {
  const org = getCurrentOrg()!;
  await updateMember({ org, memberId, role });

  revalidateTag(`${org}:members`);
}

export async function revokeInviteAction(inviteId: string) {
  const org = getCurrentOrg()!;
  await revokeInvite(org, inviteId);

  revalidateTag(`${org}:invites`);
}

const createInviteSchema = z.object({
  email: z.string().email('Invalid email address.'),
  role: roleSchema,
});

export async function createInviteAction(data: FormData): Promise<FormState> {
  const result = createInviteSchema.safeParse(Object.fromEntries(data));
  if (!result.success) {
    return {
      success: false,
      message: null,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const org = getCurrentOrg()!;
    await createInvite({ org, ...result.data });

    revalidateTag(`${org}:invites`);
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = (await error.response.json()) as { message: string };
      return {
        success: false,
        message,
        errors: null,
      };
    }

    console.error(error);

    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      errors: null,
    };
  }

  return {
    success: true,
    message: 'Invite created successfully.',
    errors: null,
  };
}
