import { Slot } from '@radix-ui/react-slot';

export function FocusRing({ children }: { children: React.ReactNode }) {
  return (
    <Slot className="rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      {children}
    </Slot>
  );
}
