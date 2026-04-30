'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/services/users.service';
import { User } from '@/types/user';

const updateUserInCache = (
  previousData:
    | { users: User[]; meta?: { page: number; limit: number; total: number; totalPages: number } }
    | undefined,
  updatedUser: User,
):
  | { users: User[]; meta?: { page: number; limit: number; total: number; totalPages: number } }
  | undefined => {
  if (!previousData) {
    return previousData;
  }

  return {
    ...previousData,
    users: previousData.users.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
  };
};

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof usersService.update>[1];
    }) => usersService.update(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previous = queryClient.getQueriesData<{
        users: User[];
        meta?: { page: number; limit: number; total: number; totalPages: number };
      }>({
        queryKey: ['users'],
      });

      previous.forEach(([queryKey, snapshot]) => {
        if (!snapshot) {
          return;
        }

        const optimisticUser = snapshot.users.find((item) => item.id === id);
        if (!optimisticUser) {
          return;
        }

        queryClient.setQueryData(
          queryKey,
          updateUserInCache(snapshot, { ...optimisticUser, ...payload }),
        );
      });

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (!context?.previous) {
        return;
      }

      context.previous.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSuccess: async (user) => {
      queryClient.setQueryData(['users', user.id], user);
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.remove,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previous = queryClient.getQueriesData<{
        users: User[];
        meta?: { page: number; limit: number; total: number; totalPages: number };
      }>({
        queryKey: ['users'],
      });

      previous.forEach(([queryKey, snapshot]) => {
        if (!snapshot) {
          return;
        }

        queryClient.setQueryData(queryKey, {
          ...snapshot,
          users: snapshot.users.filter((user) => user.id !== id),
        });
      });

      return { previous };
    },
    onError: (_error, _id, context) => {
      if (!context?.previous) {
        return;
      }

      context.previous.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
