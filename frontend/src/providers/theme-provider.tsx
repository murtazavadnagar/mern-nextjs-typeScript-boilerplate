'use client';

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { ReactNode, useMemo } from 'react';
import { featureFlags } from '@/utils/feature-flags';
import { useThemeStore } from '@/store/theme.store';

interface Props {
  children: ReactNode;
}

export const AppThemeProvider = ({ children }: Props): ReactNode => {
  const { isDarkMode } = useThemeStore();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: featureFlags.darkMode && isDarkMode ? 'dark' : 'light',
          primary: {
            main: '#176087',
          },
          secondary: {
            main: '#eb5e28',
          },
          background: {
            default: featureFlags.darkMode && isDarkMode ? '#0f1720' : '#f4f8fb',
            paper: featureFlags.darkMode && isDarkMode ? '#1f2937' : '#ffffff',
          },
        },
        typography: {
          fontFamily: 'var(--font-sans)',
          h1: {
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
          },
          h2: {
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
          },
        },
        shape: {
          borderRadius: 12,
        },
      }),
    [isDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
