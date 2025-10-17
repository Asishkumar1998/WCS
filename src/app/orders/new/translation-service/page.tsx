"use client";

import { Container, Grid } from "@mui/material";
import TranslationServiceForm from "@/components/features/Orders/Forms/TranslationServiceForm";
import TranslationServiceSidebar from "@/components/features/Orders/Sidebars/TranslationServiceSidebar";

export default function TranslationService() {
  return (
    <Container maxWidth="xl" sx={{ mt: 12 }}>
      <Grid container spacing={2}>
        {/* Left side - form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <TranslationServiceForm />
        </Grid>

        {/* Right side - FAQ */}
        <Grid size={{ xs: 12, md: 4 }}>
          <TranslationServiceSidebar />
        </Grid>
      </Grid>
    </Container>
  );
}
