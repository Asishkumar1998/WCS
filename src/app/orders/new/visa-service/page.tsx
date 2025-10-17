"use client";

import { Container, Grid } from "@mui/material";
import VisaServiceForm from "@/components/features/Orders/Forms/VisaServiceForm";
import VisaServiceSidebar from "@/components/features/Orders/Sidebars/VisaServiceSidebar";

export default function VisaService() {
  return (
    <Container maxWidth="xl" sx={{ mt: 12 }}>
      <Grid container spacing={2}>
        {/* Left side - form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <VisaServiceForm />
        </Grid>

        {/* Right side - FAQ */}
        <Grid size={{ xs: 12, md: 4 }}>
          <VisaServiceSidebar />
        </Grid>
      </Grid>
    </Container>
  );
}
