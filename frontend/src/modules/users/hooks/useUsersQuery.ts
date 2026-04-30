'use client';

import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/services/users.service';
import { QUERY_KEYS } from '@/utils/constants';
import { UsersQueryParams } from '@/types/user';

export const useUsersQuery = (params: UsersQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.users(params),
    queryFn: () => usersService.list(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useUserByIdQuery = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.user(id),
    queryFn: () => usersService.getById(id),
    enabled: Boolean(id),
  });
};
