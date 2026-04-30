'use client';

import { Alert, Box, Button, Stack, Typography } from '@mui/material';

interface Props {
  error: Error;
  reset: () => void;
}

const ErrorPage = ({ error, reset }: Props)=> {
  return (
    <Box sx={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', px: 2 }}>
      <Stack spacing={2} sx={{ maxWidth: 520 }}>
        <Typography variant="h4">Unexpected error</Typography>
        <Alert severity="error">{error.message || 'Something went wrong.'}</Alert>
        <Button variant="contained" onClick={reset}>
          Try again
        </Button>
      </Stack>
    </Box>
  );
};

export default ErrorPage;
