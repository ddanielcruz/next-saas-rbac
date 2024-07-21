import Image from 'next/image';

import rocketseatIcon from '@/assets/rocketseat-icon.svg';

import { ProfileButton } from './profile-button';

export function Header() {
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
      </div>

      <div className="flex items-center gap-4">
        <ProfileButton />
      </div>
    </header>
  );
}
