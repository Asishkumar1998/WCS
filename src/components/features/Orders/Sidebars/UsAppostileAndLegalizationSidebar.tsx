"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  Box,
} from "@mui/material";
import FAQSidebarLayout from "@/components/layout/SideDrawer/FAQSideDrawerLayout";
import Image from "next/image";

export default function USAppostileAndLegalizationSidebar() {
  return (
    <FAQSidebarLayout>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        WCS Express FAQ
      </Typography>

      <Card sx={{ height: "40%" }}>
        <CardContent>
          {/* Title */}
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 2, color: "primary.main" }}
          >
            Apostille Services
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {/* Bullet points */}
          <List dense disablePadding>
            <ListItem sx={{ display: "list-item", pl: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Apostille is French for “certification” and represents the
                authentication of an official gold seal or signature on a
                document. If you are sending your documents to a country that is
                part of the 1961 Hague Convention, an Apostille certificate is
                used as proof of authenticity among the member nations.
              </Typography>
            </ListItem>

            <ListItem sx={{ display: "list-item", pl: 2 }}>
              <Typography variant="body2" color="text.secondary">
                An Apostille signifies that the document has been reviewed,
                approved, and certified as an authentic copy of an original and
                that the certifying party has the authority to conduct such a
                review.
              </Typography>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Example Image */}
      <Box
        sx={{ border: "1px solid #ddd", borderRadius: 1, overflow: "hidden" }}
      >
        <Image
          src="/certificate-image.png"
          alt="Apostille Sample"
          width={400}
          height={450}
        />
      </Box>
    </FAQSidebarLayout>
  );
}
