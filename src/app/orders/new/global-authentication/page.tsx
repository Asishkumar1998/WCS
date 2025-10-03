"use client";

import { Container, Grid } from "@mui/material";
import FAQSidebarLayout from "@/components/layout/SideDrawer/FAQSideDrawerLayout";
import GlobalAuthenticationForm from "@/components/features/Orders/Forms/GlobalAuthenticationForm";
import GlobalAuthenticationSidebar from "@/components/features/Orders/Sidebars/GlobalAuthenticationSidebar";

export default function GlobalAuthentication() {
  return (
    <Container maxWidth="xl" sx={{ mt: 12 }}>
      <Grid container spacing={2}>
        {/* Left side - form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <GlobalAuthenticationForm />
        </Grid>

        {/* Right side - FAQ */}
        <Grid size={{ xs: 12, md: 4 }}>
          <GlobalAuthenticationSidebar />
        </Grid>
      </Grid>
    </Container>
  );
}
