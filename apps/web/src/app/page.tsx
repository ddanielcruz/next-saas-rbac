import Link from 'next/link';

import { auth } from '@/auth/auth';
import { Button } from '@/components/ui/button';

export default async function Home() {
  await auth();

  return (
    <div className="flex h-screen items-center justify-center">
      <Button asChild>
        <Link href="api/auth/sign-out">Sign out</Link>
      </Button>
    </div>
  );
}
