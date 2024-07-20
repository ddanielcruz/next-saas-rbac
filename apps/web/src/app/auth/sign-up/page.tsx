import Image from 'next/image';
import Link from 'next/link';

import githubIcon from '@/assets/github-icon.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import { signInWithGitHub } from '../actions';

export const metadata = {
  title: 'Sign up',
};

export default function SignUpPage() {
  return (
    <div className="space-y-4">
      <form action="" className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" name="email" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" name="password" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="passwordConfirmation">Confirm your password</Label>
          <Input type="password" id="passwordConfirmation" name="passwordConfirmation" />
        </div>

        <Button type="submit" className="w-full">
          Create account
        </Button>

        <Button type="submit" variant="link" className="w-full" size="sm" asChild>
          <Link href="/auth/sign-in">Already registered? Sign in</Link>
        </Button>
      </form>

      <Separator />

      <form action={signInWithGitHub}>
        <Button type="submit" variant="outline" className="w-full">
          <Image src={githubIcon} alt="" className="mr-2 size-4 dark:invert" />
          Sign in with GitHub
        </Button>
      </form>
    </div>
  );
}
