import type { Role } from '@prisma/client';
import { defineAbilityFor, userSchema } from '@saas/auth';

export function getUserPermissions(userId: string, role: Role) {
  const user = userSchema.parse({ id: userId, role });
  return defineAbilityFor(user);
}
