"use client";

import { Typography, Divider } from "@mui/material";
import FAQSidebarLayout from "@/components/layout/SideDrawer/FAQSideDrawerLayout";

const bulkOrderingText = [
  {
    title: "Single Document, Multiple Countries",
    description:
      "Select one document and choose multiple destination countries. This option is ideal when the same document needs to be authenticated or legalized for more than one country.",
  },
  {
    title: "Single Country, Multiple Documents",
    description:
      "Select multiple document types and assign them to a single country. Each document must be uploaded separately along with its corresponding customer reference.",
  },
  {
    title: "Multiple Documents, Multiple Countries",
    description:
      "Choose multiple documents and multiple destination countries. Each document can be mapped to one or more countries, making this option suitable for complex bulk legalization requirements.",
  },
] as const;

type BulkOrderingType = 0 | 1 | 2;

interface BulkOrderingSidebarProps {
  type?: BulkOrderingType;
}

export default function BulkOrderingSidebar({
  type = 0,
}: BulkOrderingSidebarProps) {
  const content = bulkOrderingText[type];

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
        Bulk Ordering Guide{" "}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        {content.title}
      </Typography>

      <Typography variant="body2" color="text.secondary">
        {content.description}
      </Typography>
    </FAQSidebarLayout>
  );
}
