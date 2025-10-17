"use client";

import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Avatar,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip,
  Tooltip,
  IconButton,
  Card,
  CardContent,
  InputAdornment,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import SearchIcon from "@mui/icons-material/Search";
import VerifiedIcon from "@mui/icons-material/Verified";

function TabPanel({
  children,
  value,
  index,
}: {
  children: React.ReactNode;
  value: number;
  index: number;
}) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ mt: 2 }}>{children}</Box>}
    </div>
  );
}

const addresses = [
  {
    id: 1,
    line1: "146, S-B, 3, 78",
    city: "Indore, MP, 452010",
    country: "India",
    defaultShipping: true,
    defaultBilling: true,
  },
  {
    id: 2,
    line1: "8/1, 5th Main, Gayathri Nagar",
    city: "Bangalore, Karnataka, 560021",
    country: "India",
    phone: "9886677887",
    defaultShipping: false,
    defaultBilling: false,
  },
];

const faqs = [
  {
    question: "How can I be a customer of WCS?",
    answer:
      "Register on the WCS Express portal by visiting www.wcss.com, then choose the Order Now tab on the home page. The new customer will receive a welcome message with password.",
  },
  {
    question: "How can I submit my document with U.S. origination?",
    answer:
      "Once logged in to WCS Express, choose among destination categories: All Countries, Hague and Non-Hague. Then select the country of destination from the list. Proceed as instructed, until Check Out. This is the process submitting documents originating in US. The process for legalization of international documents originating from outside the U.S. is available in the international section.",
  },
  {
    question:
      "How can I submit my document with OUS-, international-originating documents?",
    answer:
      "Click the green button labeled Global Document Authentication. Select both originating and destination countries, then proceed to order documents. Once the order is submitted, WCS will contact the customer to explain specific requirements for the countries chosen.",
  },
  {
    question:
      "What do you mean by general document, government document, and shipping/commercial document?",
    answer:
      "There are three basic document types requiring official authentication: 1) General Documents: These are issued privately or by a state or local government body (for example: Letter of Attorney, ISO Certifications, Affidavits, Agreements) 2) Government Documents: Issued by Federal agencies like the FDA, DHS, FBI, and others (e.g., birth certificates, FBI background checks) 3) Shipping/Commercial Documents: Documents used for importing/exporting products (Certificates of Origin, Bills of Lading, Commercial Invoices).",
  },
  {
    question: "How can I communicate with WCS?",
    answer:
      "Each pending order has a Communication Tab on the order page, to which the customer has full and constant access. Inbound messages and queries from WCS will also be in this tab.",
  },
  {
    question: "How can I add return shipping label?",
    answer:
      "Shipping labels can be uploaded to the order, where prompted for shipping options. Shipping labels can also be mailed with original documents or ordered via the WCS Fedex Account.",
  },
  {
    question: "What are the various modes through which I can make payments?",
    answer:
      "WCS offers easy payments through Debit Card, Credit Card, and Pay Later options, which include Check, Purchase Order, Wire/ACH Transfer, and Credit Card.",
  },
  {
    question: "How can I download/print Cover letter of my order?",
    answer:
      "Completing Check Out, the order forms and cover letter will appear, available to print and download.",
  },
  {
    question: "How can I view my pending/completed orders and proceed?",
    answer:
      "Access all orders in the Profile section of WCS Express. All you need is to sign-in.",
  },
  {
    question: "How can I change my user password?",
    answer:
      "Log into the Customer Portal and click on your name beside the Profile icon. Then click on Change Password and follow the prompts.",
  },
  {
    question: "How can I add another shipping/billing address?",
    answer:
      "Enter the Profile section. From there, view existing address and add new address with + button. The Default address can also be changed.",
  },
  {
    question: "How can I edit my profile?",
    answer: "Edit/view customer data from the Profile tab in My Account.",
  },
  {
    question: "Which countries have special requirements?",
    answer:
      "Once an order is completed in Check Out, WCS reviews the order and advises the client, based on document type and countries involved, of any special requirements.",
  },
  {
    question: "If a file does not upload successfully, what should I do?",
    answer:
      "Please email the files to info@wcss.com and WCS will process the documents for you.",
  },
  {
    question: "What should I do if file size exceeds 5MB?",
    answer: "WCS has increased the upload capacity to 10 MB.",
  },
  {
    question: "Can I email documents to WCS?",
    answer:
      "Yes, but the preferred method for electronic documents is to upload in WCS Express.",
  },
];

export default function ProfilePage() {
  const [tab, setTab] = useState(0);

  const [search, setSearch] = useState("");

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 3, mt: "64px" }}>
      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        textColor="primary"
        indicatorColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Addresses" />
        <Tab label="Profile Info" />
        <Tab label="FAQs" />
        <Tab label="News" />
      </Tabs>

      {/* Addresses */}
      <TabPanel value={tab} index={0}>
        <Grid container spacing={3}>
          {/* Add Address Card */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper
              sx={{
                p: 3,
                height: "100%",
                textAlign: "center",
                border: "2px dashed",
                borderColor: "primary.main",
                bgcolor: "grey.50",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                "&:hover": { bgcolor: "grey.100" },
              }}
            >
              <AddIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography color="primary" fontWeight={600}>
                Add Address
              </Typography>
            </Paper>
          </Grid>

          {/* Address Cards */}
          {addresses.map((addr) => (
            <Grid key={addr.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  height: "100%",
                  position: "relative",
                  borderLeft: `6px solid ${
                    addr.defaultShipping ? "#1976d2" : "#9e9e9e"
                  }`,
                }}
                elevation={3}
              >
                {/* Top Action Buttons */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <Tooltip title="Edit">
                    <IconButton size="small" color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Address Content */}
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  sx={{ mb: 0.5 }}
                >
                  {addr.line1}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {addr.city}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {addr.country}
                </Typography>
                {addr.phone && (
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    color="text.primary"
                    gutterBottom
                  >
                    📞 {addr.phone}
                  </Typography>
                )}

                {/* Chips for Defaults */}
                <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {addr.defaultShipping && (
                    <Chip
                      icon={<LocalShippingIcon />}
                      label="Default Shipping"
                      color="primary"
                      size="small"
                      variant="filled"
                      sx={{ p: 2 }}
                    />
                  )}
                  {addr.defaultBilling && (
                    <Chip
                      icon={<HomeWorkIcon />}
                      label="Default Billing"
                      color="success"
                      size="small"
                      variant="filled"
                      sx={{ p: 2 }}
                    />
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Profile Info */}
      <TabPanel value={tab} index={1}>
        <Card
          sx={{
            mb: 3,
            borderRadius: 2,
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            boxShadow: 2,
          }}
        >
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Avatar
              sx={{
                bgcolor: "white",
                color: "primary.main",
                width: 64,
                height: 64,
              }}
            >
              RR
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Raghvendra Roy
              </Typography>
              <Typography
                variant="body2"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <EmailIcon fontSize="small" /> raghvendra@redintegro.com
              </Typography>
              <Chip
                icon={<VerifiedIcon />}
                label="Approved"
                color="success"
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Profile Information
            </Typography>

            <Grid container spacing={3}>
              {/* Personal Info */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  defaultValue="Raghvendra"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Last Name" defaultValue="Roy" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  defaultValue="7987876459"
                />
              </Grid>

              {/* Company Info */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Company"
                  defaultValue="Redintegro2"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Industry"
                  defaultValue="Technology/IT"
                  InputProps={{
                    startAdornment: (
                      <BusinessIcon
                        fontSize="small"
                        sx={{ mr: 1, color: "gray" }}
                      />
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {/* Buttons */}
            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined">Cancel</Button>
              <Button variant="contained" color="primary">
                Save Changes
              </Button>
            </Box>
          </CardContent>
        </Card>
      </TabPanel>

      {/* FAQs */}
      <TabPanel value={tab} index={2}>
        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search FAQs..."
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3,
            borderRadius: 2,
            bgcolor: "background.paper",
            boxShadow: 1,
          }}
        />

        {/* FAQ List */}
        {filteredFaqs
          .filter((f) =>
            f.question.toLowerCase().includes(search.toLowerCase())
          )
          .map((faq, idx) => (
            <Accordion
              key={idx}
              disableGutters
              sx={{
                mb: 1.5,
                borderRadius: 2,
                "&:before": { display: "none" },
                boxShadow: 1,
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon color="primary" />}
                sx={{
                  minHeight: "42px !important", // smaller height
                  "& .MuiAccordionSummary-content": {
                    my: "4px", // compact
                  },
                }}
              >
                <Typography variant="subtitle2" fontWeight={600}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ py: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}

        {filteredFaqs.filter((f) =>
          f.question.toLowerCase().includes(search.toLowerCase())
        ).length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            mt={3}
          >
            No FAQs match your search.
          </Typography>
        )}
      </TabPanel>

      {/* News */}
      <TabPanel value={tab} index={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Latest News
          </Typography>
          <Typography variant="body2" color="text.secondary">
            🔔 New update available! Orders section now supports bulk uploads.
          </Typography>
        </Paper>
      </TabPanel>
    </Box>
  );
}
