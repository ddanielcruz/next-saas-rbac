import { useState, useTransition } from 'react';

export interface FormState {
  success: boolean;
  message: string | null;
  errors: Record<string, string[]> | null;
}

export function useFormState(
  action: (data: FormData) => Promise<FormState>,
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

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await action(formData);
      setFormState(result);
    });
  }

  return [formState, handleAction, isPending] as const;
}
