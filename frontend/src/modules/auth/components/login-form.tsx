'use client';

import { Alert, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { LoginFormValues } from '../hooks/useLoginForm';

interface Props {
  control: Control<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  onSubmit: () => void;
  isSubmitting: boolean;
  serverError: string | null;
}

export const LoginForm = ({
  control,
  errors,
  onSubmit,
  isSubmitting,
  serverError,
}: Props)=> {
  return (
    <Card sx={{ maxWidth: 460, width: '100%', boxShadow: 8 }}>
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={3}>
          <div>
            <Typography variant="h4" gutterBottom>
              Sign in
            </Typography>
            <Typography color="text.secondary">Welcome back. Please enter your credentials.</Typography>
          </div>

          {serverError ? <Alert severity="error">{serverError}</Alert> : null}

          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Username"
                fullWidth
                error={Boolean(errors.username)}
                helperText={errors.username?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="password"
                label="Password"
                fullWidth
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
              />
            )}
          />

          <Button onClick={onSubmit} disabled={isSubmitting} variant="contained" size="large">
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
