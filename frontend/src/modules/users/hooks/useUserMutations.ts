'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/constants';
import { usersService } from '@/services/users.service';
import { User } from '@/types/user';

type UsersListCache = {
  users: User[];
  meta?: { page: number; limit: number; total: number; totalPages: number };
};

const isUsersListCache = (value: unknown): value is UsersListCache => {
  return typeof value === 'object' && value !== null && Array.isArray((value as UsersListCache).users);
};

const updateUserInCache = (
  previousData: UsersListCache | undefined,
  updatedUser: User,
):
  | UsersListCache
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
      const previous = queryClient.getQueriesData<unknown>({ queryKey: ['users'] });

      previous.forEach(([queryKey, snapshot]) => {
        if (!isUsersListCache(snapshot)) {
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

      const previousUser = queryClient.getQueryData<User>(QUERY_KEYS.user(id));
      if (previousUser) {
        queryClient.setQueryData<User>(QUERY_KEYS.user(id), { ...previousUser, ...payload });
      }

      return { previous, previousUser };
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return;
      }

      context.previous.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      if (context.previousUser) {
        queryClient.setQueryData(QUERY_KEYS.user(context.previousUser.id), context.previousUser);
      }
    },
    onSuccess: async (user) => {
      queryClient.setQueryData(QUERY_KEYS.user(user.id), user);
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
      const previous = queryClient.getQueriesData<unknown>({ queryKey: ['users'] });

      previous.forEach(([queryKey, snapshot]) => {
        if (!isUsersListCache(snapshot)) {
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
