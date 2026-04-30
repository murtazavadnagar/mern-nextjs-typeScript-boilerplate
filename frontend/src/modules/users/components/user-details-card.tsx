'use client';

import { Chip, Paper, Stack, Typography } from '@mui/material';
import { User } from '@/types/user';

interface Props {
  user: User;
}

export const UserDetailsCard = ({ user }: Props) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h5">{user.fullName}</Typography>
        <Typography color="text.secondary">Username: {user.username}</Typography>
        <Typography color="text.secondary">Email: {user.email}</Typography>
        <Stack direction="row" spacing={1}>
          <Chip
            label={user.role}
            color={user.role === 'ADMIN' ? 'secondary' : user.role === 'GUEST' ? 'info' : 'primary'}
          />
          <Chip
            label={user.isActive ? 'Active' : 'Inactive'}
            color={user.isActive ? 'success' : 'warning'}
          />
        </Stack>
      </Stack>
    </Paper>
  );
};
