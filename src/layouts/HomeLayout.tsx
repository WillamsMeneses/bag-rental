import { Container } from '@mui/material';
import HomeNavbar from "@/components/ui/HomeNavbar";
import { Outlet } from "react-router-dom";

export default function HomeLayout() {
  return (
    <>
      <HomeNavbar />
      <Container maxWidth="xl" sx={{px: { xs: 2, sm: 3, md: 4 } }}>
        <Outlet />
      </Container>
    </>
  );
}