'use client';

import { DarkMode, LightMode, Logout } from '@mui/icons-material';
import { AppBar, Box, Button, Container, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { toast } from 'sonner';
import { useLogoutMutation } from '@/modules/auth/hooks/useAuthActions';
import { useAuthStore } from '@/store/auth.store';
import { useThemeStore } from '@/store/theme.store';
import { featureFlags } from '@/utils/feature-flags';
import { ROUTES } from '@/utils/constants';

interface Props {
  children: ReactNode;
}

export const AppShell = ({ children }: Props)=> {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const { isDarkMode, toggleMode } = useThemeStore();
  const logoutMutation = useLogoutMutation();

  const handleLogout = async (): Promise<void> => {
    try {
      await logoutMutation.mutateAsync();
      toast.success('Logged out successfully');
      router.replace(ROUTES.login);
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <Box sx={{ minHeight: '100dvh', background: 'linear-gradient(145deg, rgba(23,96,135,.06), rgba(235,94,40,.04))' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            User Management System
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            {featureFlags.darkMode ? (
              <IconButton onClick={toggleMode} color="inherit" aria-label="toggle theme">
                {isDarkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
            ) : null}

            <Typography variant="body2" color="text.secondary">
              {user?.fullName ?? 'Unknown user'}
            </Typography>

            <Button
              color="inherit"
              startIcon={<Logout />}
              onClick={() => {
                void handleLogout();
              }}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <Stack spacing={2} mb={2}>
          <Typography variant="h4">
            {pathname.includes('/dashboard/users/') ? 'User Profile' : 'Users'}
          </Typography>
        </Stack>
        {children}
      </Container>
    </Box>
  );
};
