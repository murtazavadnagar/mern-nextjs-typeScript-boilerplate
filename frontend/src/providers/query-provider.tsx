'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

interface Props {
  children: ReactNode;
}

export const QueryProvider = ({ children }: Props): ReactNode => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              const statusCode = (error as { response?: { status?: number } }).response?.status;

              if (statusCode === 401) {
                return false;
              }

              return failureCount < 2;
            },
            staleTime: 30 * 1000,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
