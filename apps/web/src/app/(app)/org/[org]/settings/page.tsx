import { getCurrentOrg } from '@/auth';
import { getUserAbility } from '@/auth/ability';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getOrganization } from '@/http/get-organization';

import { OrganizationForm } from '../../organization-form';
import { ShutdownOrganizationButton } from './shutdown-organization-button';

export default async function Settings() {
  const permissions = await getUserAbility();
  const orgSlug = getCurrentOrg()!;
  const { organization } = await getOrganization(orgSlug);

  const canUpdateOrg = permissions?.can('update', 'Organization');
  const canShutdownOrg = permissions?.can('delete', 'Organization');
  const canReadBilling = permissions?.can('read', 'Billing');

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>

      {canUpdateOrg && (
        <Card>
          <CardHeader>
            <CardTitle>Organization settings</CardTitle>
            <CardDescription>Update your organization details.</CardDescription>
          </CardHeader>
          <CardContent>
            <OrganizationForm isUpdating initialData={organization} />
          </CardContent>
        </Card>
      )}

      {canReadBilling && (
        <Card>
          <CardHeader>
            <CardTitle>Billing</CardTitle>
            <CardDescription>Manage your billing information.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Coming soon...</p>
          </CardContent>
        </Card>
      )}

      {canShutdownOrg && (
        <Card>
          <CardHeader>
            <CardTitle>Shutdown Organization</CardTitle>
            <CardDescription>
              Once you shutdown your organization, all data will be permanently deleted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ShutdownOrganizationButton />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
