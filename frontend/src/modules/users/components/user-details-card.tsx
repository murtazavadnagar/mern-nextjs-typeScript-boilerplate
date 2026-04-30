'use client';

import { Chip, Paper, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { User } from '@/types/user';

interface Props {
  user: User;
}

export const UserDetailsCard = ({ user }: Props) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h5">{user.fullName}</Typography>
        {user.profileImageUrl ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '')}${user.profileImageUrl}`}
            width={140}
            height={140}
            alt={`${user.fullName} profile`}
            style={{ borderRadius: 12, objectFit: 'cover' }}
          />
        ) : null}
        <Typography color="text.secondary">Username: {user.username}</Typography>
        <Typography color="text.secondary">Email: {user.email}</Typography>
        <Stack direction="row" spacing={1}>
          <Chip
            label={user.role}
            color={
              user.role === 'ADMIN' ? 'secondary' : user.role === 'GUEST' ? 'warning' : 'primary'
            }
          />
          <Chip
            label={user.isActive ? 'Active' : 'Inactive'}
            color={user.isActive ? 'success' : 'default'}
          />
        </Stack>
      </Stack>
    </Paper>
  );
};
