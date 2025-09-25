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
    question: "What documents can be translated?",
    answer:
      "We provide certified translations for passports, birth certificates, marriage certificates, legal agreements, academic transcripts, and many other personal or business documents.",
  },
  {
    question: "Are translations certified and accepted internationally?",
    answer:
      "Yes. All translations are certified, notarized if required, and widely accepted by government offices, embassies, universities, and international organizations.",
  },
  {
    question: "How long does a translation usually take?",
    answer:
      "Most translation requests are completed within 2–3 business days. Urgent or expedited services are also available depending on the document type and language pair.",
  },
  {
    question: "Do you support multiple languages?",
    answer:
      "Yes, we support translations in over 100 languages including Spanish, French, German, Arabic, Chinese, Japanese, and many more.",
  },
];

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
