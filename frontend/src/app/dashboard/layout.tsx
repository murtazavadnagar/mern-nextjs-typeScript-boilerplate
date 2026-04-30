'use client';

import { ReactNode } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { useAuthGuard } from '@/hooks/useAuthGuard';

interface Props {
  children: ReactNode;
}

const DashboardLayout = ({ children }: Props)=> {
  const isAllowed = useAuthGuard();

  if (!isAllowed) {
    return <div />;
  }

  return <AppShell>{children}</AppShell>;
};

export default DashboardLayout;
