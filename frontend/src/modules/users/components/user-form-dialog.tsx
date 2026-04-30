'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { User } from '@/types/user';

const createSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  fullName: z.string().min(3),
  role: z.enum(['ADMIN', 'USER', 'GUEST']),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/\d/)
    .regex(/[^a-zA-Z\d]/),
});

const updateSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(3),
  role: z.enum(['ADMIN', 'USER', 'GUEST']),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/\d/)
    .regex(/[^a-zA-Z\d]/)
    .optional()
    .or(z.literal('')),
  isActive: z.boolean(),
});

type CreateFormValues = z.infer<typeof createSchema>;
type UpdateFormValues = z.infer<typeof updateSchema>;

interface Props {
  open: boolean;
  mode: 'create' | 'edit';
  initialUser?: User;
  isSubmitting: boolean;
  onClose: () => void;
  onCreate: (values: CreateFormValues) => Promise<void>;
  onUpdate: (values: UpdateFormValues) => Promise<void>;
}

export const UserFormDialog = ({
  open,
  mode,
  initialUser,
  isSubmitting,
  onClose,
  onCreate,
  onUpdate,
}: Props) => {
  const createForm = useForm<CreateFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      username: '',
      email: '',
      fullName: '',
      role: 'USER',
      password: '',
    },
  });

  const updateForm = useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      email: '',
      fullName: '',
      role: 'USER',
      password: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (mode === 'edit' && initialUser) {
      updateForm.reset({
        email: initialUser.email,
        fullName: initialUser.fullName,
        role: initialUser.role,
        password: '',
        isActive: initialUser.isActive,
      });
    }

    if (mode === 'create') {
      createForm.reset({
        username: '',
        email: '',
        fullName: '',
        role: 'USER',
        password: '',
      });
    }
  }, [createForm, initialUser, mode, updateForm]);

  const createSubmit = createForm.handleSubmit(async (values) => {
    await onCreate(values);
  });

  const updateSubmit = updateForm.handleSubmit(async (values) => {
    await onUpdate(values);
  });

  if (mode === 'create') {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Create User</DialogTitle>
        <DialogContent>
          <Stack spacing={2} pt={1}>
            <Controller
              name="username"
              control={createForm.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Username"
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="fullName"
              control={createForm.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Full Name"
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="email"
              control={createForm.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Email"
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="role"
              control={createForm.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  label="Role"
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                >
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="USER">User</MenuItem>
                  <MenuItem value="GUEST">Guest</MenuItem>
                </TextField>
              )}
            />

            <Controller
              name="password"
              control={createForm.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Password"
                  type="password"
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={() => void createSubmit()} variant="contained" disabled={isSubmitting}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update User</DialogTitle>
      <DialogContent>
        <Stack spacing={2} pt={1}>
          <Controller
            name="fullName"
            control={updateForm.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Full Name"
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={updateForm.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Email"
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="role"
            control={updateForm.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="Role"
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              >
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="USER">User</MenuItem>
                <MenuItem value="GUEST">Guest</MenuItem>
              </TextField>
            )}
          />

          <Controller
            name="isActive"
            control={updateForm.control}
            render={({ field }) => (
              <TextField
                select
                label="Status"
                value={String(field.value)}
                onChange={(event) => field.onChange(event.target.value === 'true')}
              >
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </TextField>
            )}
          />

          <Controller
            name="password"
            control={updateForm.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="New Password (optional)"
                type="password"
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => void updateSubmit()} variant="contained" disabled={isSubmitting}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
