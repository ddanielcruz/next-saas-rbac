'use client';

import * as SheetPrimitive from '@radix-ui/react-dialog';
import { useRouter } from 'next/navigation';
import * as React from 'react';

export type InterceptedSheetProps = Omit<SheetPrimitive.DialogProps, 'defaultOpen'>;

export function InterceptedSheet({ onOpenChange, ...props }: InterceptedSheetProps) {
  const router = useRouter();

  function handleOnOpenChange(value: boolean) {
    onOpenChange?.(value);

    if (!value) {
      router.back();
    }
  }

  return <SheetPrimitive.Root defaultOpen onOpenChange={handleOnOpenChange} {...props} />;
}
