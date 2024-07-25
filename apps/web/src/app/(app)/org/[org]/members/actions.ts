'use server';

import { revalidateTag } from 'next/cache';

import { getCurrentOrg } from '@/auth';
import { removeMember } from '@/http/remove-member';

export async function removeMemberAction(memberId: string) {
  const org = getCurrentOrg()!;
  await removeMember(org, memberId);

  revalidateTag(`${org}:members`);
}
