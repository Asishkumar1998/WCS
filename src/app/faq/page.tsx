"use client"

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useMemo, useState } from "react";
import { getFAQ } from "@/services/dashboardService";

interface FAQ {
  faqId: number;
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | false>(false);
  const [search, setSearch] = useState("");

  const getFAQData = async () => {
      const response = await getFAQ();
      setFaqs(response);
      setLoading(false);
  }

  useEffect(() => {
    getFAQData();
  }, []);

  const filteredFaqs = useMemo(() => {
    if (!search) return faqs;
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase())
    );
  }, [faqs, search]);

  const handleChange =
    (panel: number) => (_: any, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Container maxWidth="md" sx={{ py: 6, mt: 5 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Typography color="text.secondary">
          Find answers to common questions about documents, orders, payments, and
          account management.
        </Typography>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search questions or keywords..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
      />

      {/* Loading */}
      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {/* FAQ List */}
      {!loading &&
        filteredFaqs.map((faq) => (
          <Accordion
            key={faq.faqId}
            expanded={expanded === faq.faqId}
            onChange={handleChange(faq.faqId)}
            sx={{
              mb: 1,
              borderRadius: 2,
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={500}>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ whiteSpace: "pre-line", lineHeight: 1.7 }}
              >
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}

      {/* Empty State */}
      {!loading && filteredFaqs.length === 0 && (
        <Typography color="text.secondary" textAlign="center" mt={4}>
          No FAQs found matching your search.
        </Typography>
      )}
    </Container>
  );
}
