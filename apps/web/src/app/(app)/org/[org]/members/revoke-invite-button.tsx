import { XOctagonIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { revokeInviteAction } from './actions';

interface RevokeInviteButtonProps {
  inviteId: string;
}

export function RevokeInviteButton({ inviteId }: RevokeInviteButtonProps) {
  return (
    <form action={revokeInviteAction.bind(null, inviteId)}>
      <Button type="submit" size="sm" variant="destructive">
        <XOctagonIcon className="mr-2 size-4" />
        Revoke invite
      </Button>
    </form>
  );
}
