import { ChevronDownIcon, LogOutIcon } from 'lucide-react';

import { auth } from '@/auth';
import { getNameInitials } from '@/utils/formatting';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { FocusRing } from './ui/focus-ring';

export async function ProfileButton() {
  const { user } = await auth();
  const nameInitials = user.name ? getNameInitials(user.name) : '';

  return (
    <DropdownMenu>
      <FocusRing>
        <DropdownMenuTrigger className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>

          <Avatar className="size-8">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name ?? ''} />}
            <AvatarFallback>{nameInitials}</AvatarFallback>
          </Avatar>

          <ChevronDownIcon className="size-4 text-muted-foreground" />
        </DropdownMenuTrigger>
      </FocusRing>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <a href="/api/auth/sign-out">
            <LogOutIcon className="mr-2 size-4" />
            Sign out
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
