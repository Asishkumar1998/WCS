"use client";

import { Typography, Divider, ListItem, List, Box } from "@mui/material";
import Image from "next/image";
import FAQSidebarLayout from "@/components/layout/SideDrawer/FAQSideDrawerLayout";

export default function GlobalAuthenticationSidebar() {
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
        Global Authentication
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
              WCS can provide authentication services in the country of origin
              of the document.
            </Typography>
          </ListItem>

          <ListItem sx={{ display: "list-item", pl: 2 }}>
            <Typography variant="body2" color="#1F2937" fontWeight={700}>
              Typically originals are required (whether electronic or
              originals).
            </Typography>
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 2 }}>
            <Typography variant="body2" color="#1F2937" fontWeight={700}>
              The process varies per country, as does the estimated processing
              times and fees.
            </Typography>
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 2 }}>
            <Typography variant="body2" color="#1F2937" fontWeight={700}>
              The process varies per country, as does the estimated processing
              times and fees.
            </Typography>
          </ListItem>
        </List>
        <Image
          src="/global-authentication.jpg"
          alt="Global Authentication Cards"
          width={400}
          height={250}
          style={{ width: "100%", height: "auto", marginTop: "50px" }}
        />
      </Box>
    </FAQSidebarLayout>
  );
}
