import { Loader2Icon, type LucideProps } from 'lucide-react';

import { cn } from '@/lib/tailwind';

export function Spinner({ className, ...props }: LucideProps) {
  return <Loader2Icon className={cn('animate-spin text-inherit', className)} {...props} />;
}
