import { AbilityBuilder, CreateAbility, createMongoAbility, MongoAbility } from '@casl/ability';

import { User } from './models';
import { permissions } from './permissions';
import { BillingSubject } from './subjects/billing';
import { InviteSubject } from './subjects/invite';
import { OrganizationSubject } from './subjects/organization';
import { ProjectSubject } from './subjects/project';
import { UserSubject } from './subjects/user';

export * from './models';

type AppAbilities =
  | UserSubject
  | ProjectSubject
  | OrganizationSubject
  | InviteSubject
  | BillingSubject
  | ['manage', 'all'];

export type AppAbility = MongoAbility<AppAbilities>;

const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export function defineAbilityFor(user: User) {
  if (!permissions[user.role]) {
    throw new Error(`Permissions for role "${user.role}" are not defined.`);
  }

  const builder = new AbilityBuilder(createAppAbility);
  permissions[user.role](user, builder);

  const ability = builder.build({ detectSubjectType: (subject) => subject.__typename });

  return ability;
}
