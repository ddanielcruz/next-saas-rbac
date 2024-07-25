import { getUserAbility } from '@/auth/ability';

import { Invites } from './invites';
import { MemberList } from './member-list';

export default async function Members() {
  const permissions = await getUserAbility();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Members</h1>

      <div className="space-y-4">
        {permissions?.can('read', 'Invite') && <Invites />}
        {permissions?.can('read', 'User') && <MemberList />}
      </div>
    </div>
  );
}
