'use client';

import { ArrowBack } from '@mui/icons-material';
import { Button, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { ComponentErrorBoundary } from '@/components/common/component-error-boundary';
import { LoadingSkeleton } from '@/components/common/loading-skeleton';
import { useUserByIdQuery } from '../hooks/useUsersQuery';
import { UserDetailsCard } from '../components/user-details-card';

interface Props {
  userId: string;
}

export const UserDetailsContainer = ({ userId }: Props) => {
  const userQuery = useUserByIdQuery(userId);

  if (userQuery.isLoading) {
    return <LoadingSkeleton />;
  }

  if (userQuery.isError || !userQuery.data) {
    return (
      <Stack spacing={2}>
        <Typography color="error">User not found or request failed.</Typography>
        <Button component={Link} href="/dashboard/users" startIcon={<ArrowBack />}>
          Back to users
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Button
        component={Link}
        href="/dashboard/users"
        startIcon={<ArrowBack />}
        sx={{ width: 'fit-content' }}
      >
        Back to users
      </Button>

      <ComponentErrorBoundary fallbackMessage="Could not render user profile.">
        <UserDetailsCard user={userQuery.data} />
      </ComponentErrorBoundary>
    </Stack>
  );
};
