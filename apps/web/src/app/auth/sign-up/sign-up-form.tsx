'use client';

import { AlertTriangleIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import githubIcon from '@/assets/github-icon.svg';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/form-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { useFormState } from '@/hooks/use-form-state';

import { signInWithGitHub } from '../actions';
import { signUpAction } from './actions';

export default function SignUpForm() {
  const router = useRouter();
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(signUpAction, () =>
    router.push('/auth/sign-in'),
  );

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {!success && message && (
          <Alert variant="destructive">
            <AlertTriangleIcon className="size-4" />
            <AlertTitle>Sign in failed!</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" />
          {errors?.name && <FormError>{errors.name[0]}</FormError>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" name="email" />
          {errors?.email && <FormError>{errors.email[0]}</FormError>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" name="password" />
          {errors?.password && <FormError>{errors.password[0]}</FormError>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="passwordConfirmation">Confirm your password</Label>
          <Input type="password" id="passwordConfirmation" name="passwordConfirmation" />
          {errors?.passwordConfirmation && <FormError>{errors.passwordConfirmation[0]}</FormError>}
        </div>

        <Button type="submit" className="w-full" loading={isPending}>
          {isPending ? <Spinner /> : 'Create account'}
        </Button>

        <Button type="submit" variant="link" className="w-full" size="sm" asChild>
          <Link href="/auth/sign-in">Already registered? Sign in</Link>
        </Button>
      </form>

      <Separator />

      <form action={signInWithGitHub}>
        <Button type="submit" variant="outline" className="w-full">
          <Image src={githubIcon} alt="" className="mr-2 size-4 dark:invert" />
          Sign up with GitHub
        </Button>
      </form>
    </div>
  );
}
