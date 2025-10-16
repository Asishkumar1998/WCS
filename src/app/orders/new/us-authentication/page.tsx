"use client";

import { Container, Grid } from "@mui/material";
import USAppostileAndLegalizationForm from "@/components/features/Orders/Forms/UsAppostileAndLegalizationForm";
import USAppostileAndLegalizationSidebar from "@/components/features/Orders/Sidebars/UsAppostileAndLegalizationSidebar";

export default function USAuthentication() {
  return (
    <Container maxWidth="xl" sx={{ mt: 12 }}>
      <Grid container spacing={2}>
        {/* Left side - form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <USAppostileAndLegalizationForm />
        </Grid>

        {/* Right side - FAQ */}
        <Grid size={{ xs: 12, md: 4 }}>
          <USAppostileAndLegalizationSidebar />
        </Grid>
      </Grid>
    </Container>
  );
}
