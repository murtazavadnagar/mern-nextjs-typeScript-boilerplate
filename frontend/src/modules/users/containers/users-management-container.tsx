'use client';

import { Add } from '@mui/icons-material';
import { Alert, Button, Card, CardContent, Stack } from '@mui/material';
import { isAxiosError } from 'axios';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ComponentErrorBoundary } from '@/components/common/component-error-boundary';
import { LoadingSkeleton } from '@/components/common/loading-skeleton';
import { User } from '@/types/user';
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from '../hooks/useUserMutations';
import { useUsersFiltersReducer } from '../hooks/useUsersFiltersReducer';
import { useUsersQuery } from '../hooks/useUsersQuery';
import { UserDeleteDialog } from '../components/user-delete-dialog';
import { UserFormDialog } from '../components/user-form-dialog';
import { UsersTable } from '../components/users-table';
import { UsersToolbar } from '../components/users-toolbar';

export const UsersManagementContainer = () => {
  const { state, dispatch, queryParams } = useUsersFiltersReducer();
  const usersQuery = useUsersQuery(queryParams);

  const createMutation = useCreateUserMutation();
  const updateMutation = useUpdateUserMutation();
  const deleteMutation = useDeleteUserMutation();

  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteTargetUser, setDeleteTargetUser] = useState<User | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const users = usersQuery.data?.users ?? [];
  const total = usersQuery.data?.meta?.total ?? 0;

  const mutationPending = useMemo(
    () => createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    [createMutation.isPending, deleteMutation.isPending, updateMutation.isPending],
  );

  const openCreateDialog = (): void => {
    setDialogMode('create');
    setSelectedUser(undefined);
    setIsDialogOpen(true);
  };

  const openEditDialog = (user: User): void => {
    setDialogMode('edit');
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const closeDialog = (): void => {
    setIsDialogOpen(false);
    setSelectedUser(undefined);
  };

  const openDeleteDialog = (user: User): void => {
    setDeleteTargetUser(user);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = (): void => {
    setIsDeleteDialogOpen(false);
    setDeleteTargetUser(undefined);
  };

  const handleCreate = async (values: {
    username: string;
    email: string;
    fullName: string;
    role: 'ADMIN' | 'USER' | 'GUEST';
    password: string;
  }): Promise<void> => {
    try {
      await createMutation.mutateAsync(values);
      toast.success('User created successfully');
      closeDialog();
    } catch (error) {
      const message =
        isAxiosError<{ message?: string }>(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Failed to create user';
      toast.error(message);
    }
  };

  const handleUpdate = async (values: {
    email: string;
    fullName: string;
    role: 'ADMIN' | 'USER' | 'GUEST';
    password?: string;
    isActive: boolean;
  }): Promise<void> => {
    if (!selectedUser) {
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: selectedUser.id,
        payload: {
          ...values,
          password: values.password || undefined,
        },
      });
      toast.success('User updated successfully');
      closeDialog();
    } catch (error) {
      const message =
        isAxiosError<{ message?: string }>(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Failed to update user';
      toast.error(message);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!deleteTargetUser) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(deleteTargetUser.id);
      toast.success('User deleted');
      closeDeleteDialog();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <UsersToolbar
              defaultSearch={state.search}
              role={state.role}
              isActive={state.isActive}
              onSearchChange={(value) => dispatch({ type: 'SET_SEARCH', payload: value })}
              onRoleChange={(value) => dispatch({ type: 'SET_ROLE', payload: value })}
              onStatusChange={(value) => dispatch({ type: 'SET_IS_ACTIVE', payload: value })}
              onReset={() => dispatch({ type: 'RESET' })}
            />

            <Button startIcon={<Add />} variant="contained" onClick={openCreateDialog}>
              Create User
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {usersQuery.isError ? (
        <Alert severity="error">Failed to load users. Please retry.</Alert>
      ) : null}

      {usersQuery.isLoading ? (
        <LoadingSkeleton />
      ) : (
        <ComponentErrorBoundary fallbackMessage="Users table failed to render.">
          <UsersTable
            users={users}
            page={state.page}
            limit={state.limit}
            total={total}
            isLoading={usersQuery.isFetching}
            onPageChange={(nextPage) => dispatch({ type: 'SET_PAGE', payload: nextPage })}
            onLimitChange={(nextLimit) => dispatch({ type: 'SET_LIMIT', payload: nextLimit })}
            onEdit={openEditDialog}
            onDelete={(user) => {
              openDeleteDialog(user);
            }}
          />
        </ComponentErrorBoundary>
      )}

      <UserFormDialog
        open={isDialogOpen}
        mode={dialogMode}
        initialUser={selectedUser}
        isSubmitting={mutationPending}
        onClose={closeDialog}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />

      <UserDeleteDialog
        open={isDeleteDialogOpen}
        user={deleteTargetUser}
        isSubmitting={deleteMutation.isPending}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
      />
    </Stack>
  );
};
