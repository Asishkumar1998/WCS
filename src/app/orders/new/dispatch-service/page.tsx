"use client";

import { Container, Grid } from "@mui/material";
import DispatchServiceForm from "@/components/features/Orders/Forms/DispatchServiceForm";
import USAppostileAndLegalizationSidebar from "@/components/features/Orders/Sidebars/UsAppostileAndLegalizationSidebar";

export default function DispatchService() {
  return (
    <Container maxWidth="xl" sx={{ mt: 11 }}>
      <Grid container spacing={2}>
        {/* Left side - form */}
        <Grid size={{ xs: 10, md: 8 }}>
          <DispatchServiceForm />
        </Grid>

        {/* Right side - FAQ */}
        <Grid size={{ xs: 10, md: 4 }}>
          <USAppostileAndLegalizationSidebar />
        </Grid>
      </Grid>
    </Container>
  );
}
