'use client';

import { Box } from '@mui/material';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { LoginForm } from '../components/login-form';
import { useLoginMutation } from '../hooks/useAuthActions';
import { useLoginForm } from '../hooks/useLoginForm';
import { ROUTES } from '@/utils/constants';

export const LoginContainer = ()=> {
  const router = useRouter();
  const { control, handleSubmit, formState } = useLoginForm();
  const loginMutation = useLoginMutation();
  const [serverError, setServerError] = useState<string | null>(null);

  const submitHandler = handleSubmit(async (values) => {
    setServerError(null);

    try {
      await loginMutation.mutateAsync(values);
      toast.success('Login successful');
      router.replace(ROUTES.users);
    } catch (error) {
      const message =
        isAxiosError<{ message?: string }>(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Invalid username or password';

      setServerError(message);
      toast.error(message);
    }
  });

  const isSubmitting = useMemo(
    () => loginMutation.isPending || formState.isSubmitting,
    [formState.isSubmitting, loginMutation.isPending],
  );

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'grid',
        placeItems: 'center',
        background:
          'radial-gradient(circle at 10% 20%, rgba(23,96,135,0.22), transparent 35%), radial-gradient(circle at 90% 10%, rgba(235,94,40,0.18), transparent 40%), linear-gradient(120deg, #f3f8fc, #e9eef4)',
        px: 2,
      }}
    >
      <LoginForm
        control={control}
        errors={formState.errors}
        onSubmit={() => {
          void submitHandler();
        }}
        isSubmitting={isSubmitting}
        serverError={serverError}
      />
    </Box>
  );
};
