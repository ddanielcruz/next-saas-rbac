'use server';

import type { Role } from '@saas/auth';
import { revalidateTag } from 'next/cache';

import { getCurrentOrg } from '@/auth';
import { removeMember } from '@/http/remove-member';
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
