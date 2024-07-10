import { defineAbilityFor } from '@saas/auth';

const ability = defineAbilityFor({ id: 'any-id', role: 'admin' });

const canDeleteUser = ability.can('delete', 'User');
console.log('canDeleteUser', canDeleteUser);
