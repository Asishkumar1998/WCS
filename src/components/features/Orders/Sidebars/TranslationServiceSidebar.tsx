"use client";

import { Typography, Divider } from "@mui/material";
import FAQSidebarLayout from "@/components/layout/SideDrawer/FAQSideDrawerLayout";
import FAQAccordionList from "../Accordion/FAQAccordion";

const faqs = undefined;

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
        Translation Service FAQ
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <FAQAccordionList faqs={faqs} />
    </FAQSidebarLayout>
  );
}
