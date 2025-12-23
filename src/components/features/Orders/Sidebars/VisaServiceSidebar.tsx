"use client";

import { Typography, Box, List, ListItem } from "@mui/material";
import Image from "next/image";
import FAQSidebarLayout from "@/components/layout/SideDrawer/FAQSideDrawerLayout";

export default function VisaServiceSidebar() {
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
        Visa Service
      </Typography>

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
              A properly issued business visa permits you to participate in
              foreign markets. Quite different from a tourist visa, the business
              visa allows a wide range of activities that are otherwise
              prohibited, regarding contracts, business licenses, marketing,
              commerce, acquisitions, and more. WCS can assist you to obtain
              such a visa by providing proper guidelines on how to and when to
              apply. Some of the most requested countries for Business Visa are
              Kuwait, Qatar, Saudi, UAE, Vietnam and China.
            </Typography>
          </ListItem>

          <ListItem sx={{ display: "list-item", pl: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Requirements will vary from one country to another, so you can
              count on WCS, as the subject-matter experts. While US passport
              holders are exempt from needing business visas in most European
              countries, they are in fact required for other countries
              throughout the global marketplace.
            </Typography>
          </ListItem>
        </List>
        <Image
          src="/visa-side-panel.png"
          alt="Visa Service Cards"
          width={400}
          height={250}
          style={{ width: "100%", height: "auto" }}
        />
      </Box>
    </FAQSidebarLayout>
  );
}
