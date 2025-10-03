"use client";

import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import FAQSidebarLayout from "@/components/layout/SideDrawer/FAQSideDrawerLayout";
import FAQAccordionList from "../Accordion/FAQAccordion";

const faqs = [
  {
    question: "How do I use the Type 1 form?",
    answer:
      "In Type 1, you select a single document and specify multiple destination countries. This form is best for cases where one document needs to be authenticated or legalized for several countries at once.",
  },
  {
    question: "How do I use the Type 2 form?",
    answer:
      "In Type 2, you can select multiple document types and assign them to a country. For each document selected, you’ll upload the file and provide its respective customer reference.",
  },
];

export default function BulkOrderingSidebar() {
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
        WCS Express FAQ
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <FAQAccordionList faqs={faqs} />
    </FAQSidebarLayout>
  );
}
