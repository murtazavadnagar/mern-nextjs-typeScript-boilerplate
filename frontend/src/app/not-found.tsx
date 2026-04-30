import Link from 'next/link';
import { Button, Container, Stack, Typography } from '@mui/material';

const NotFound = ()=> {
  return (
    <Container sx={{ py: 12 }}>
      <Stack spacing={2}>
        <Typography variant="h3">404</Typography>
        <Typography color="text.secondary">The page you requested was not found.</Typography>
        <Button variant="contained" sx={{ width: 'fit-content' }}>
          <Link href="/dashboard/users">Back to Dashboard</Link>
        </Button>
      </Stack>
    </Container>
  );
};

export default NotFound;
