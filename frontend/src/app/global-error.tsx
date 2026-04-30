'use client';

import { Button, Container, Stack, Typography } from '@mui/material';

interface Props {
  error: Error;
  reset: () => void;
}

const GlobalError = ({ error, reset }: Props)=> {
  return (
    <html>
      <body>
        <Container sx={{ py: 10 }}>
          <Stack spacing={2} alignItems="flex-start">
            <Typography variant="h3">Application failure</Typography>
            <Typography color="error">{error.message || 'Unhandled application error.'}</Typography>
            <Button variant="contained" onClick={reset}>
              Reload app
            </Button>
          </Stack>
        </Container>
      </body>
    </html>
  );
};

export default GlobalError;
