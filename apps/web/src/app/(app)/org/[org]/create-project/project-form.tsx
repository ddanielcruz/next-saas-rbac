'use client';

import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangleIcon, CheckIcon } from 'lucide-react';
import { useParams } from 'next/navigation';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/form-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useFormState } from '@/hooks/use-form-state';

import { createProjectAction } from './actions';

export function ProjectForm() {
  const { org } = useParams<{ org: string }>();
  const queryClient = useQueryClient();
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    createProjectAction,
    () =>
      queryClient.invalidateQueries({
        queryKey: [org, 'projects'],
      }),
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!success && message && (
        <Alert variant="destructive">
          <AlertTriangleIcon className="size-4" />
          <AlertTitle>Failed to create project!</AlertTitle>
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
        <Label htmlFor="name">Project name</Label>
        <Input type="name" id="name" name="name" />
        {errors?.name && <FormError>{errors.name[0]}</FormError>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="name">Description</Label>
        <Textarea id="description" name="description" />
        {errors?.description && <FormError>{errors.description[0]}</FormError>}
      </div>

      <Button type="submit" className="w-full">
        {isPending ? <Spinner /> : 'Save project'}
      </Button>
    </form>
  );
}
