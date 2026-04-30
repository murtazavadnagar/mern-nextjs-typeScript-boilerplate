'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { ROUTES } from '@/utils/constants';

export const useAuthGuard = (): boolean => {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = Boolean(accessToken);

  useEffect(() => {
    if (!isLoggedIn && pathname !== ROUTES.login) {
      router.replace(ROUTES.login);
    }
  }, [isLoggedIn, pathname, router]);

  return isLoggedIn;
};
