import { SlashIcon } from 'lucide-react';
import Image from 'next/image';

import rocketseatIcon from '@/assets/rocketseat-icon.svg';
import { getUserAbility } from '@/auth/ability';
import { cn } from '@/lib/tailwind';

import { OrganizationSwitcher } from './organization-switcher';
import { ProfileButton } from './profile-button';
import { ProjectSwitcher } from './project-switcher';
import { ThemeSwitcher } from './theme/theme-switcher';
import { Separator } from './ui/separator';

interface HeaderProps {
  borderless?: boolean;
  className?: string;
}

export async function Header({ borderless = false, className }: HeaderProps) {
  const permissions = await getUserAbility();

  return (
    <div className={cn('py-3', !borderless && 'border-b', className)}>
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Image
            src={rocketseatIcon}
            alt="Rocketseat"
            className="size-6 dark:invert"
            height={24}
            width={24}
            priority
          />

          <SlashIcon className="size-3 rotate-[-24deg] text-border" />

          <OrganizationSwitcher />

          {permissions?.can('read', 'Project') && (
            <>
              <SlashIcon className="size-3 rotate-[-24deg] text-border" />
              <ProjectSwitcher />
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <ProfileButton />
          <Separator orientation="vertical" className="h-5" />
          <ThemeSwitcher />
        </div>
      </header>
    </div>
  );
}
