'use client';

import { AlertTriangleIcon, UserPlusIcon } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/form-error';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useFormState } from '@/hooks/use-form-state';

import { createInviteAction } from './actions';

export function CreateInviteForm() {
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(createInviteAction);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!success && message && (
        <Alert variant="destructive">
          <AlertTriangleIcon className="size-4" />
          <AlertTitle>Failed to invite member!</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-start gap-2">
        <div className="w-full space-y-1">
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="john@example.com"
            className="w-full"
          />
          {errors?.email && <FormError>{errors.email[0]}</FormError>}
        </div>

        <Select defaultValue="MEMBER" name="role">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="MEMBER">Member</SelectItem>
            <SelectItem value="BILLING">Billing</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit">
          {isPending ? (
            <Spinner />
          ) : (
            <>
              <UserPlusIcon className="mr-2 size-4" /> Invite member
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
