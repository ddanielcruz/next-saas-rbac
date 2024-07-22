import { SlashIcon } from 'lucide-react';
import Image from 'next/image';

import rocketseatIcon from '@/assets/rocketseat-icon.svg';
import { getUserAbility } from '@/auth/ability';

import { OrganizationSwitcher } from './organization-switcher';
import { ProfileButton } from './profile-button';

export async function Header() {
  const permissions = await getUserAbility();

  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between">
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

        {permissions?.can('read', 'Project') && <></>}
      </div>

      <div className="flex items-center gap-4">
        <ProfileButton />
      </div>
    </header>
  );
}
