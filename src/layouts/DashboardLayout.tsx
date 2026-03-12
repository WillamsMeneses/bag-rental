import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <>
      <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 }}}>
        <Outlet />
      </Container>
    </>
  );
}