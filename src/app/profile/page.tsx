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
  Divider,
  Checkbox,
  FormControlLabel,
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
      "You can register on our platform and complete your profile to become a customer.",
  },
  {
    question: "How can I submit US-origin documents?",
    answer:
      "Go to New Order → US Order section and upload the required documents.",
  },
  {
    question: "What do you mean by government documents?",
    answer:
      "These include official documents issued by recognized government authorities.",
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
        <Tab label="Orders" />
        <Tab label="Addresses" />
        <Tab label="Profile Info" />
        <Tab label="FAQs" />
        <Tab label="News" />
      </Tabs>

      {/* Orders */}
      <TabPanel value={tab} index={0}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Orders</Typography>
          <Divider sx={{ my: 2 }} />
          {/* Reuse your Orders component here */}
          <Typography variant="body2" color="text.secondary">
            Orders table will appear here.
          </Typography>
        </Paper>
      </TabPanel>

      {/* Addresses */}
      <TabPanel value={tab} index={1}>
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
      <TabPanel value={tab} index={2}>
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
      <TabPanel value={tab} index={3}>
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
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        {/* FAQ List */}
        {filteredFaqs.map((faq, idx) => (
          <Accordion
            key={idx}
            disableGutters
            sx={{
              mb: 2,
              borderRadius: 2,
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight={600}>
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

        {filteredFaqs.length === 0 && (
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
      <TabPanel value={tab} index={4}>
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
