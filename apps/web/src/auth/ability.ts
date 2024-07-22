import { defineAbilityFor } from '@saas/auth';

import { getMembership } from '@/http/get-membership';

import { getCurrentOrg } from '.';

export async function getCurrentMembership() {
  const orgSlug = getCurrentOrg();
  if (!orgSlug) {
    return null;
  }

  const { membership } = await getMembership(orgSlug);

  return membership;
}

export async function getUserAbility() {
  const membership = await getCurrentMembership();
  if (!membership) {
    return null;
  }

  return defineAbilityFor({
    id: membership.userId,
    role: membership.role,
  });
}
