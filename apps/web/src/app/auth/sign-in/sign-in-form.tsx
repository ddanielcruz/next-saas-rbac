'use client';

import { AlertTriangleIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

import githubIcon from '@/assets/github-icon.svg';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { useFormState } from '@/hooks/use-form-state';

import { signInWithEmailAndPassword } from './actions';

export function SignInForm() {
  const router = useRouter();
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    signInWithEmailAndPassword,
    () => router.push('/'),
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {!success && message && (
        <Alert variant="destructive">
          <AlertTriangleIcon className="size-4" />
          <AlertTitle>Sign in failed!</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" name="email" />

        {errors?.email && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.email[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" name="password" />

        {errors?.password && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.password[0]}</p>
        )}

        <Button asChild variant="link" size="sm" className="px-0">
          <Link href="/auth/forgot-password">Forgot your password?</Link>
        </Button>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Spinner /> : 'Sign in with email'}
      </Button>

      <Button type="submit" variant="link" className="w-full" size="sm" asChild>
        <Link href="/auth/sign-up">Create new account</Link>
      </Button>

      <Separator />

      <Button type="button" variant="outline" className="w-full">
        <Image src={githubIcon} alt="" className="mr-2 size-4 dark:invert" />
        Sign in with GitHub
      </Button>
    </form>
  );
}
