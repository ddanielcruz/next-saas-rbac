import { organizationSchema } from '@saas/auth';
import { ArrowLeftRightIcon, CrownIcon, UserMinusIcon } from 'lucide-react';

import { getCurrentOrg } from '@/auth';
import { getUserAbility } from '@/auth/ability';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { getMembers } from '@/http/get-members';
import { getMembership } from '@/http/get-membership';
import { getOrganization } from '@/http/get-organization';
import { getNameInitials } from '@/utils/formatting';

import { removeMemberAction } from './actions';

export async function MemberList() {
  const currentOrg = getCurrentOrg()!;
  const permissions = await getUserAbility();

  const [{ membership }, { members }, { organization }] = await Promise.all([
    getMembership(currentOrg!),
    getMembers(currentOrg!),
    getOrganization(currentOrg!),
  ]);
  const authOrg = organizationSchema.parse(organization);

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Members</h2>
      <div className="rounded border">
        <Table>
          <TableBody>
            {members.map((member) => {
              const name = member.name ?? '';
              const isOwner = organization.ownerId === member.userId;
              const isMe = member.userId === membership.userId;

              return (
                <TableRow key={member.id}>
                  <TableCell className="py-2.5" style={{ width: 48 }}>
                    <Avatar>
                      {member.avatarUrl && <AvatarImage src={member.avatarUrl} alt={name} />}
                      <AvatarFallback>{name && getNameInitials(name)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="inline-flex items-center gap-2 font-medium">
                        {member.name}
                        {isMe && ' (me)'}
                        {isOwner && (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <CrownIcon className="size-3" />
                            Owner
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">{member.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex items-center justify-end gap-2">
                      {!isMe && permissions?.can('transfer-ownership', authOrg) && (
                        <Button variant="ghost" size="sm">
                          <ArrowLeftRightIcon className="mr-2 size-4" />
                          Transfer ownership
                        </Button>
                      )}

                      {!isMe && !isOwner && permissions?.can('delete', 'User') && (
                        <form action={removeMemberAction.bind(null, member.id)}>
                          <Button type="submit" variant="destructive" size="sm">
                            <UserMinusIcon className="mr-2 size-4" />
                            Remove
                          </Button>
                        </form>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
