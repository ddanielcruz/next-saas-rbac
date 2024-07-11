import { AbilityBuilder } from '@casl/ability';

import { AppAbility } from '.';
import { User } from './models';
import { Role } from './roles';

type DefinePermissions = (user: User, builder: AbilityBuilder<AppAbility>) => void;

export const permissions: Record<Role, DefinePermissions> = {
  ADMIN(user, { can, cannot }) {
    can('manage', 'all');

    // When using "manage all," we need to restrict full access to a subject by using "cannot,"
    // so we can add conditions to a permission.
    cannot('manage', 'Organization');
    can('manage', 'Organization', { ownerId: { $eq: user.id } });
  },
  MEMBER(user, { can }) {
    can('read', 'User');
    can(['create', 'read'], 'Project');
    can(['update', 'delete'], 'Project', { ownerId: { $eq: user.id } });
  },
  BILLING(_user, { can }) {
    can('manage', 'Billing');
  },
};
