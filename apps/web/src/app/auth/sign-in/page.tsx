import Image from 'next/image';
import Link from 'next/link';

import githubIcon from '@/assets/github-icon.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export const metadata = {
  title: 'Sign In',
};

export default function SignInPage() {
  return (
    <form action="" className="space-y-5">
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" name="email" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" name="password" />

        <Button asChild variant="link" className="px-0">
          <Link href="/auth/forgot-password">Forgot your password?</Link>
        </Button>
      </div>

      <Button type="submit" className="w-full">
        Sign in with email
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
