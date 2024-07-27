import dayjs from 'dayjs';
import dayjsRelativeTime from 'dayjs/plugin/relativeTime';
import { CheckCircleIcon, LogInIcon, LogOutIcon } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth, isAuthenticated } from '@/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { acceptInvite } from '@/http/accept-invite';
import { getInvite } from '@/http/get-invite';
import { getNameInitials } from '@/utils/formatting';

dayjs.extend(dayjsRelativeTime);

interface InvitePageProps {
  params: {
    id: string;
  };
}

export default async function InvitePage({ params }: InvitePageProps) {
  const inviteId = params.id;
  const { invite } = await getInvite(inviteId);
  const { author, organization } = invite;

  const isUserAuthenticated = isAuthenticated();
  let currentUserEmail: string | null = null;

  if (isUserAuthenticated) {
    const { user } = await auth();
    currentUserEmail = user.email;
  }

  const isUserAuthenticatedWithSameEmailFromInvite = currentUserEmail === invite.email;

  async function signInFromInvite() {
    'use server';

    cookies().set('inviteId', inviteId);
    redirect(`/auth/sign-in?email=${invite.email}`);
  }

  async function acceptInviteAction() {
    'use server';

    await acceptInvite(inviteId);

    redirect('/');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col justify-center space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="size-16">
            {!!author?.avatarUrl && <AvatarImage src={author.avatarUrl} />}
            <AvatarFallback className="text-xl">
              {!!author?.name && getNameInitials(author.name)}
            </AvatarFallback>
          </Avatar>

          <p className="text-balance text-center leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">{author?.name ?? 'Someone'}</span> invited
            you to join <span className="font-medium text-foreground">{organization.name}</span>{' '}
            {dayjs(invite.createdAt).fromNow()}.
          </p>
        </div>

        <Separator />

        {!isUserAuthenticated && (
          <form action={signInFromInvite}>
            <Button type="submit" variant="secondary" className="w-full">
              <LogInIcon className="mr-2 size-4" />
              Sign up to accept the invite
            </Button>
          </form>
        )}

        {isUserAuthenticatedWithSameEmailFromInvite && (
          <form action={acceptInviteAction}>
            <Button type="submit" variant="secondary" className="w-full">
              <CheckCircleIcon className="mr-2 size-4" />
              Join {organization.name}
            </Button>
          </form>
        )}

        {isUserAuthenticated && !isUserAuthenticatedWithSameEmailFromInvite && (
          <div className="space-y-4">
            <p className="text-balance text-center text-sm leading-relaxed text-muted-foreground">
              This invite was sent to{' '}
              <span className="font-medium text-foreground">{invite.email}</span> but you are
              currently authenticated as{' '}
              <span className="font-medium text-foreground">{currentUserEmail}</span>.
            </p>

            <div className="space-y-2">
              <Button variant="secondary" className="w-full" asChild>
                <a href="/api/auth/sign-out">
                  <LogOutIcon className="mr-2 size-4" />
                  Sign out
                </a>
              </Button>

              <Button variant="outline" className="w-full" asChild>
                <Link href="/">Back to dashboard</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
