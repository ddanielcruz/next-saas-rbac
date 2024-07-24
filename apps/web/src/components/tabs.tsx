import { getCurrentOrg } from '@/auth';
import { getUserAbility } from '@/auth/ability';

import { NavLink } from './nav-link';
import { Button } from './ui/button';

export async function Tabs() {
  const org = getCurrentOrg();
  const permissions = await getUserAbility();

  const canReadProjects = permissions?.can('read', 'Project');
  const canReadMembers = permissions?.can('read', 'User');
  const canUpdateOrg = permissions?.can('update', 'Organization');
  const canReadBilling = permissions?.can('read', 'Billing');

  return (
    <div className="border-b py-3 pt-2">
      <nav className="mx-auto flex max-w-7xl items-center gap-2">
        {canReadProjects && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
          >
            <NavLink href={`/org/${org}`}>Projects</NavLink>
          </Button>
        )}
        {canReadMembers && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
          >
            <NavLink href={`/org/${org}/members`}>Members</NavLink>
          </Button>
        )}
        {(canUpdateOrg || canReadBilling) && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
          >
            <NavLink href={`/org/${org}/settings`}>Settings & Billing</NavLink>
          </Button>
        )}
      </nav>
    </div>
  );
}
