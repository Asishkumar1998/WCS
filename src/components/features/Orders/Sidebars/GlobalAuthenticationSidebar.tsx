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
    question: "Why do I need to authentication/legalize document?",
    answer:
      "International business and trade transformation require that the document reflecting exchanges be authenticated. We get more specific to this question below.",
  },
  {
    question: "What is Embassy or Document Legalization & Authentication?",
    answer:
      "It refers to the process of verifying documents through embassy or consular channels.",
  },
  {
    question: "What is an Apostille and how do I get one?",
    answer:
      "An Apostille is a certificate that authenticates documents for use internationally under the Hague Convention.",
  },
  {
    question: "What is an Apostille Seal or Stamp?",
    answer:
      "It’s a physical seal or stamp affixed to the document to prove authenticity.",
  },
  {
    question:
      "How do I know if a particular country follows the Apostille process or not?",
    answer:
      "You can check the Hague Convention member list or contact local authorities.",
  },
  {
    question:
      "How do I know if there is a change in a procedure for a country?",
    answer: "Stay updated with embassy notices or government advisories.",
  },
  {
    question:
      "What about the apostille process for a personal document certificates?",
    answer:
      "The process involves notarization, submission to state authorities, and authentication.",
  },
  {
    question:
      "What is the U.S. Department of State Apostille and Authentication process?",
    answer:
      "It’s the federal-level authentication service provided by the U.S. State Department.",
  },
  {
    question: "What is your pricing like?",
    answer: "Pricing depends on the document type and processing urgency.",
  },
  {
    question: "What is your turnaround time like?",
    answer:
      "Turnaround time varies between same-day, express, and standard processing.",
  },
  {
    question:
      "I am so confused. Where do I start? I don’t have the time. I need help.",
    answer: "Contact our support team for step-by-step assistance.",
  },
  {
    question:
      "Do I need to notarize my documents before getting an Apostille or Authentication?",
    answer:
      "Some documents require notarization before apostille. Check your document type.",
  },
  {
    question: "How long is an Apostille valid, and does it expire?",
    answer:
      "An Apostille does not expire, but the underlying document validity matters.",
  },
];

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
        WCS Express FAQ
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <FAQAccordionList faqs={faqs} />
    </FAQSidebarLayout>
  );
}
