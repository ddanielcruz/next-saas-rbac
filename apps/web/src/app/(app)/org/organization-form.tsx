'use client';

import { AlertTriangleIcon, CheckIcon } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError } from '@/components/ui/form-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useFormState } from '@/hooks/use-form-state';

import {
  createOrganizationAction,
  type OrganizationSchema,
  updateOrganizationAction,
} from './actions';

interface OrganizationFormProps {
  isUpdating?: boolean;
  initialData?: OrganizationSchema;
}

export function OrganizationForm({ isUpdating = false, initialData }: OrganizationFormProps) {
  const formAction = isUpdating ? updateOrganizationAction : createOrganizationAction;
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(formAction);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!success && message && (
        <Alert variant="destructive">
          <AlertTriangleIcon className="size-4" />
          <AlertTitle>Failed to create organization!</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {success && message && (
        <Alert variant="success">
          <CheckIcon className="size-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="name">Organization name</Label>
        <Input type="name" id="name" name="name" defaultValue={initialData?.name} />
        {errors?.name && <FormError>{errors.name[0]}</FormError>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="domain">Email domain</Label>
        <Input
          id="domain"
          name="domain"
          inputMode="url"
          placeholder="example.com"
          defaultValue={initialData?.domain ?? undefined}
        />
        {errors?.domain && <FormError>{errors.domain[0]}</FormError>}
      </div>

      <div className="space-y-1">
        <div className="flex space-x-2">
          <Checkbox
            name="shouldAttachUsersByDomain"
            id="shouldAttachUsersByDomain"
            defaultChecked={initialData?.shouldAttachUsersByDomain}
          />
          <div className="grid gap-1.5 leading-none">
            <label htmlFor="shouldAttachUsersByDomain" className="space-y-1">
              <span className="text-sm font-medium leading-none">
                Automatically join new members
              </span>
            </label>
            <p className="text-sm leading-none text-muted-foreground">
              This will automatically invite all members with same email domain to join the
              organization.
            </p>
            {errors?.shouldAttachUsersByDomain && (
              <FormError>{errors.shouldAttachUsersByDomain[0]}</FormError>
            )}
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full">
        {isPending ? <Spinner /> : 'Save organization'}
      </Button>
    </form>
  );
}
