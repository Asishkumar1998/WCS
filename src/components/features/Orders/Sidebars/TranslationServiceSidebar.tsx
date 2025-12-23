"use client";

import { Typography, Divider, Box, List, ListItem } from "@mui/material";
import Image from "next/image";
import FAQSidebarLayout from "@/components/layout/SideDrawer/FAQSideDrawerLayout";

export default function TranslationServiceSidebar() {
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
        Translation Service
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
              This service provides translation to and from English.{" "}
            </Typography>
          </ListItem>

          <ListItem sx={{ display: "list-item", pl: 2 }}>
            <Typography variant="body2" color="text.secondary">
              WCS translation supports more than 120 languages. Most common
              languages are Spanish, Arabic, French.
            </Typography>
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 2 }}>
            <Typography variant="body2" color="text.secondary">
              We invite you to contact us for translations of
              pharmaceutical-labels, government approvals, assignments of
              agency, Letters of Attorney, academic credentials—a full menu
              documents requiring government approvals.{" "}
            </Typography>
          </ListItem>
        </List>
        <Image
          src="/translation-side-panel.jpg"
          alt="Translation Service Cards"
          width={400}
          height={250}
          style={{ width: "100%", height: "auto", marginTop: "50px" }}
        />
      </Box>
    </FAQSidebarLayout>
  );
}
