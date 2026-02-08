"use client";

import { Typography, Box, List, ListItem, Divider } from "@mui/material";
import FAQSidebarLayout from "@/components/layout/SideDrawer/FAQSideDrawerLayout";

export default function DispatchServiceSidebar() {
  return (
    <FAQSidebarLayout>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          textAlign: "center",
          mb: 2,
          color: "primary.main",
        }}
      >
        Dispatch Service
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          mt: 3,
          border: "1px solid #ddd",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <List dense disablePadding>
          <ListItem sx={{ display: "list-item", pl: 2, mt: 2 }}>
            <Typography variant="body2" color="#1F2937" fontWeight={700}>
              This service is for forwarding the document to the recipient
              (domestic or international). No other service will be performed
              (notary/apostille/legalization).
            </Typography>
          </ListItem>
        </List>
      </Box>
    </FAQSidebarLayout>
  );
}
