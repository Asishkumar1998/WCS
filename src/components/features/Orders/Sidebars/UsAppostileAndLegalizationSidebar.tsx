"use client";

import { Typography, Divider, Box, List, ListItem } from "@mui/material";
import Image from "next/image";
import FAQSidebarLayout from "@/components/layout/SideDrawer/FAQSideDrawerLayout";
import { getSidebarContent } from "./US Rules/getSidebarContent";

interface Props {
  country: any;
  document: any;
}

export default function USAppostileAndLegalizationSidebar({
  country,
  document,
}: Props) {
  const content = getSidebarContent(country, document);

  if (!content) return null;

  return (
    <FAQSidebarLayout>
      {content.flag && (
        <Image
          src={content.flag}
          alt="Country Flag"
          width={80}
          height={50}
          style={{
            display: "block",
            margin: "0 auto 12px",
          }}
        />
      )}

      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          textAlign: "center",
          mb: 2,
          color: "primary.main",
        }}
      >
        {content.title}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ mt: 2 }}>
        <List dense disablePadding>
          {content.paragraphs.map((text, index) => (
            <ListItem key={index} sx={{ pl: 0, mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {text}
              </Typography>
            </ListItem>
          ))}
        </List>

        <Image
          src={content.sampleDoc}
          alt="Sample Document"
          width={400}
          height={250}
          style={{ width: "100%", height: "auto", marginTop: 24 }}
        />
      </Box>
    </FAQSidebarLayout>
  );
}
