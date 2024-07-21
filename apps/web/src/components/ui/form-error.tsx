import { cn } from '@/lib/tailwind';

export interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function FormError({ className, ...props }: FormErrorProps) {
  return (
    <p className={cn('text-xs font-medium text-red-500 dark:text-red-400', className)} {...props} />
  );
}
