"use client";

import { Container, Grid } from "@mui/material";
import NotaryServiceForm from "@/components/features/Orders/Forms/NotaryServiceForm";
import USAppostileAndLegalizationSidebar from "@/components/features/Orders/Sidebars/UsAppostileAndLegalizationSidebar";

export default function NotaryService() {
  return (
    <Container maxWidth="xl" sx={{ mt: 12 }}>
      <Grid container spacing={2}>
        {/* Left side - form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <NotaryServiceForm />
        </Grid>

        {/* Right side - FAQ */}
        <Grid size={{ xs: 12, md: 4 }}>
          <USAppostileAndLegalizationSidebar />
        </Grid>
      </Grid>
    </Container>
  );
}
