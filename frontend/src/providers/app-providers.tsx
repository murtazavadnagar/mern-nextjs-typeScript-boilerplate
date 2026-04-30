'use client';

import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { QueryProvider } from './query-provider';
import { AppThemeProvider } from './theme-provider';

interface Props {
  children: ReactNode;
}

export const AppProviders = ({ children }: Props): ReactNode => {
  return (
    <QueryProvider>
      <AppThemeProvider>
        {children}
        <Toaster richColors position="top-right" />
      </AppThemeProvider>
    </QueryProvider>
  );
};
