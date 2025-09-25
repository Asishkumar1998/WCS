"use client";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionListProps {
  faqs: FAQItem[];
}

export default function FAQAccordionList({ faqs }: FAQAccordionListProps) {
  return (
    <>
      {faqs.map((faq, idx) => (
        <Accordion
          key={idx}
          disableGutters
          sx={{
            mb: 1,
            border: "1px solid #e0e0e0",
            boxShadow: "none",
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography sx={{ fontWeight: 500, fontSize: "0.9rem" }}>
              {faq.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
              {faq.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
