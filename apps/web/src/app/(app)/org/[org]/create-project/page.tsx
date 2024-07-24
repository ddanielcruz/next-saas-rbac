import { redirect } from 'next/navigation';

import { getCurrentOrg } from '@/auth';
import { getUserAbility } from '@/auth/ability';
import { Header } from '@/components/header';

import { ProjectForm } from './project-form';

export default async function CreateProject() {
  const permissions = await getUserAbility();

  if (!permissions || permissions.cannot('create', 'Project')) {
    const org = getCurrentOrg();
    redirect(`/org/${org}`);
  }

  return (
    <div>
      <Header />
      <main className="mx-auto w-full max-w-7xl space-y-4 p-4">
        <h1 className="text-2xl font-bold">Create project</h1>
        <ProjectForm />
      </main>
    </div>
  );
}
