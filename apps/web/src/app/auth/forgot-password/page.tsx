import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const metadata = {
  title: 'Forgot Password',
};

export default function ForgotPasswordPage() {
  return (
    <form action="" className="space-y-5">
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" name="email" />
      </div>

      <Button type="submit" className="w-full">
        Recover password
      </Button>

      <Button type="submit" variant="link" className="w-full" size="sm" asChild>
        <Link href="/auth/sign-in">Sign in instead</Link>
      </Button>
    </form>
  );
}
