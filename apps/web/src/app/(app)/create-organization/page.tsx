import { Header } from '@/components/header';

import { OrganizationForm } from './organization-form';

export default function CreateOrganization() {
  return (
    <div>
      <Header />
      <main className="mx-auto w-full max-w-7xl space-y-4 p-4">
        <h1 className="text-2xl font-bold">Create organization</h1>
        <OrganizationForm />
      </main>
    </div>
  );
}
