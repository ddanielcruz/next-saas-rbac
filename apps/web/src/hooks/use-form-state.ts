import { useState, useTransition } from 'react';
import { requestFormReset } from 'react-dom';

export interface FormState {
  success: boolean;
  message: string | null;
  errors: Record<string, string[]> | null;
}

export function useFormState(
  action: (data: FormData) => Promise<FormState>,
  onSuccess?: () => Promise<void> | void,
  initialState?: FormState,
) {
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<FormState>(
    initialState ?? {
      success: false,
      message: null,
      errors: null,
    },
  );

  function handleAction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await action(formData);

      if (result.success) {
        await onSuccess?.();
        requestFormReset(form);
      }

      setFormState(result);
    });
  }

  return [formState, handleAction, isPending] as const;
}
