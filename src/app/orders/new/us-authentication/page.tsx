"use client";

import { Container, Grid } from "@mui/material";
import USAppostileAndLegalizationForm from "@/components/features/Orders/Forms/UsAppostileAndLegalizationForm";
import USAppostileAndLegalizationSidebar from "@/components/features/Orders/Sidebars/UsAppostileAndLegalizationSidebar";
import { useState } from "react";

export interface DocType {
  docTypeId: number;
  docTypeName: string;
  docCategoryId: number;
  personalDoc: number;
  physicalRequired: number;
  createdBy: any;
  createdAt: number;
  modifiedBy: any;
  modifiedAt: number;
  ordSequence: any;
  attachmentRequired: any;
  isDeleted: boolean;
}

export default function USAuthentication() {
  const [country, setCountry] = useState<any>();
  const [document, setDocument] = useState<DocType | null>(null);

  return (
    <Container maxWidth="xl" sx={{ mt: 11 }}>
      <Grid container spacing={2}>
        {/* Left side - form */}
        <Grid size={{ xs: 10, md: 8 }}>
          <USAppostileAndLegalizationForm
            country={country}
            setCountry={setCountry}
            document={document}
            setDocument={setDocument}
          />
        </Grid>

        {/* Right side - FAQ */}
        <Grid size={{ xs: 10, md: 4 }}>
          <USAppostileAndLegalizationSidebar country={country} document={document} />
        </Grid>
      </Grid>
    </Container>
  );
}
