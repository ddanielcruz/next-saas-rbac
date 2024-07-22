import { ChevronsUpDownIcon, PlusCircleIcon } from 'lucide-react';
import Link from 'next/link';

import { getCurrentOrg } from '@/auth';
import { getOrganizations } from '@/http/get-organizations';
import { getNameInitials } from '@/utils/formatting';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { FocusRing } from './ui/focus-ring';

export async function OrganizationSwitcher() {
  const { organizations } = await getOrganizations();

  const currentOrgSlug = getCurrentOrg();
  const currentOrg = organizations.find((org) => org.slug === currentOrgSlug);

  return (
    <DropdownMenu>
      <FocusRing>
        <DropdownMenuTrigger className="flex w-[168px] select-none items-center gap-2 rounded p-1 text-sm font-medium">
          {currentOrg ? (
            <>
              <Avatar className="!size-4">
                {currentOrg.avatarUrl && (
                  <AvatarImage src={currentOrg.avatarUrl} alt={currentOrg.name} />
                )}
                <AvatarFallback>{getNameInitials(currentOrg.name, 1)}</AvatarFallback>
              </Avatar>
              <span className="truncate text-left">{currentOrg.name}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Select organization</span>
          )}
          <ChevronsUpDownIcon className="ml-auto size-4 text-muted-foreground" />
        </DropdownMenuTrigger>
      </FocusRing>
      <DropdownMenuContent align="end" alignOffset={-16} sideOffset={12} className="w-[200px]">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          {organizations.map((org) => {
            const nameInitials = getNameInitials(org.name, 1);

            return (
              <DropdownMenuItem key={org.id} asChild>
                <Link href={`/org/${org.slug}`}>
                  <Avatar className="mr-2 !size-4">
                    {org.avatarUrl && <AvatarImage src={org.avatarUrl} alt={org.name} />}
                    <AvatarFallback>{nameInitials}</AvatarFallback>
                  </Avatar>
                  <span className="line-clamp-1">{org.name}</span>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/create-organization">
            <PlusCircleIcon className="mr-2 size-4" />
            Create new
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
