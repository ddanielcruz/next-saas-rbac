'use client';

import type { Role } from '@saas/auth';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { updateMemberAction } from './actions';

interface UpdateMemberRoleSelectProps extends React.ComponentProps<typeof Select> {
  memberId: string;
}

export function UpdateMemberRoleSelect({ memberId, ...props }: UpdateMemberRoleSelectProps) {
  async function updateMemberRole(role: Role) {
    await updateMemberAction(memberId, role);
  }

  return (
    <Select onValueChange={updateMemberRole} {...props}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ADMIN">Admin</SelectItem>
        <SelectItem value="MEMBER">Member</SelectItem>
        <SelectItem value="BILLING">Billing</SelectItem>
      </SelectContent>
    </Select>
  );
}
