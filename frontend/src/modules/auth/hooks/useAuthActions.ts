'use client';

import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

export const useLoginMutation = () => {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (result) => {
      setSession(result.accessToken, result.user);
    },
  });
};

export const useLogoutMutation = () => {
  const clearSession = useAuthStore((state) => state.clearSession);

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      clearSession();
    },
  });
};
