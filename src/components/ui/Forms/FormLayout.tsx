// src/components/forms/FormLayout.tsx
"use client";

import React from "react";
import { Paper, Typography, Divider, Grid, Button } from "@mui/material";

interface FormLayoutProps {
  title: string;
  children: React.ReactNode;
}

const FormLayout: React.FC<FormLayoutProps> = ({ title, children }) => {
  return (
    <Paper sx={{ height: "100%", border: "1px solid #e0e0e0", py: 1.5, px: 3 }}>
      <Typography
        color="primary.main"
        variant="h5"
        sx={{ mb: 1, fontWeight: 600 }}
      >
        {title}
      </Typography>

      <Divider sx={{ mb: 2.5 }} />

      <Grid container spacing={2}>
        {children}

        {/* Buttons */}
        <Grid
          size={{ xs: 12 }}
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}
        >
          <Button variant="outlined" color="primary">
            Add to cart
          </Button>
          <Button variant="contained" color="primary">
            Proceed to cart
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FormLayout;
