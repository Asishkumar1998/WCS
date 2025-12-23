"use client";

import { Typography, Box, List, ListItem, Divider } from "@mui/material";
import Image from "next/image";
import FAQSidebarLayout from "@/components/layout/SideDrawer/FAQSideDrawerLayout";

export default function NotaryServiceSidebar() {
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
        Notary Service
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
            <Typography variant="body2" color="text.secondary">
              This service provides only notary to the document (no apostille or
              embassy legalization).
            </Typography>
          </ListItem>

          <ListItem sx={{ display: "list-item", pl: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Document will be notarized and certified by the county clerk.
            </Typography>
          </ListItem>
        </List>
        <Image
          src="/notary-side-panel.jpg"
          alt="Notary Service Cards"
          width={400}
          height={250}
          style={{ width: "100%", height: "auto", marginTop: "50px" }}
        />
      </Box>
    </FAQSidebarLayout>
  );
}
