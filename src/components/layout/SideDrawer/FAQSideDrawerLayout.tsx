"use client";

import { Paper, Box } from "@mui/material";
import { ReactNode } from "react";

interface SidebarLayoutProps {
  children: ReactNode;
}

export default function FAQSidebarLayout({ children }: SidebarLayoutProps) {
  return (
    <Paper
      sx={{
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        border: "1px solid #e0e0e0",
      }}
    >
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Paper>
  );
}
