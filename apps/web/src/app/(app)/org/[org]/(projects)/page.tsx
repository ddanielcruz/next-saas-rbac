import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

import { getCurrentOrg } from '@/auth';
import { getUserAbility } from '@/auth/ability';
import { Button } from '@/components/ui/button';

import { ProjectList } from './project-list';

export const metadata = {
  title: 'Projects',
};

export default async function Projects() {
  const permissions = await getUserAbility();
  const currentOrg = getCurrentOrg()!;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>

        {permissions?.can('create', 'Project') && (
          <Button size="sm" asChild>
            <Link href={`/org/${currentOrg}/create-project`}>
              <PlusIcon className="mr-2 size-4" />
              Create project
            </Link>
          </Button>
        )}
      </div>

      {permissions?.can('read', 'Project') ? (
        <ProjectList />
      ) : (
        <p className="text-sm text-muted-foreground">
          You are not allowed to see the organization projects.
        </p>
      )}
    </div>
  );
}
