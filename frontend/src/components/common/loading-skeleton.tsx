'use client';

import { Card, Skeleton, Stack } from '@mui/material';

export const LoadingSkeleton = ()=> {
  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Skeleton variant="text" width="40%" height={40} />
        <Skeleton variant="rectangular" height={50} />
        <Skeleton variant="rectangular" height={50} />
        <Skeleton variant="rectangular" height={50} />
      </Stack>
    </Card>
  );
};
