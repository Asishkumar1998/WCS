"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  IconButton,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  TextField,
  RadioGroup,
  Radio,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface FeeItem {
  label: string;
  amount: number;
}

interface TimelineStep {
  label: string;
  sub: string;
}

interface DocumentGroup {
  id: string;
  country: string;
  authority: string;
  timeline: TimelineStep[];
  fees: FeeItem[];
}

// 🔹 Custom Connector
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.divider,
    borderRadius: 1,
  },
}));

// 🔹 Custom Step Icon
const StepIconRoot = styled("div")<{
  ownerState: { active?: boolean; completed?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: ownerState.active
    ? theme.palette.primary.main
    : ownerState.completed
    ? theme.palette.success.main
    : theme.palette.grey[300],
  color: "#fff",
  display: "flex",
  borderRadius: "50%",
  width: 32,
  height: 32,
  justifyContent: "center",
  alignItems: "center",
  boxShadow: ownerState.active
    ? `0 0 8px ${theme.palette.primary.main}`
    : "none",
}));

function CustomStepIcon(props: any) {
  const { active, completed, icon } = props;
  const icons: { [index: string]: React.ReactElement } = {
    1: <WorkOutlineIcon fontSize="small" />,
    2: <WorkOutlineIcon fontSize="small" />,
    3: <ScheduleIcon fontSize="small" />,
    4: <CheckCircleIcon fontSize="small" />,
  };

  return (
    <StepIconRoot ownerState={{ active, completed }}>
      {icons[String(icon)]}
    </StepIconRoot>
  );
}

// Dummy Data
const dummyDocs: DocumentGroup[] = [
  {
    id: "1",
    country: "Albania",
    authority: "General",
    timeline: [
      { label: "Secretary of State", sub: "7 business days" },
      { label: "Estimated Completion", sub: "Oct 13, 2025" },
    ],
    fees: [
      { label: "MD-SOS", amount: 20 },
      { label: "WCS Service Fee", amount: 90 },
    ],
  },
  {
    id: "2",
    country: "Afghanistan",
    authority: "Federal Government",
    timeline: [
      { label: "U.S. Department of State", sub: "20 business days" },
      { label: "Embassy", sub: "7 business days" },
      { label: "Estimated Completion", sub: "Nov 12, 2025" },
    ],
    fees: [
      { label: "USDOS Authentication", amount: 20 },
      { label: "Afghanistan Legalization", amount: 125 },
      { label: "Money Order Fee", amount: 10 },
      { label: "WCS Service Fee", amount: 110 },
    ],
  },
];

export default function OrderMilestonePage() {
  const [docs, setDocs] = useState(dummyDocs);
  const [invoiceRef, setInvoiceRef] = useState("");

  const handleDelete = (id: string) => {
    setDocs(docs.filter((d) => d.id !== id));
  };

  const totalAmount = docs
    .reduce((sum, d) => sum + d.fees.reduce((fSum, f) => fSum + f.amount, 0), 0)
    .toFixed(2);

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "background.default",
        minHeight: "100vh",
        mt: "64px",
      }}
    >
      {/* Shipping Instructions */}
      <Card
        sx={{
          border: "1px solid #e0e0e0",
          mb: 3,
        }}
      >
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            mb={2}
            gap={2}
          >
            <Typography variant="h6" fontWeight={600}>
              Shipping Label / Return Instructions
            </Typography>

            {/* 🔸 Small, rounded Invoice Reference Field */}
            <TextField
              placeholder="Invoice Reference / PO Number"
              size="small"
              value={invoiceRef}
              onChange={(e) => setInvoiceRef(e.target.value)}
              sx={{
                width: { xs: "100%", sm: "300px" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "50px",
                  bgcolor: "background.paper",
                },
              }}
            />
          </Box>

          {/* Shipping options */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControlLabel
                control={<Checkbox />}
                label="Upload return shipping label"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControlLabel
                control={<Checkbox />}
                label="Enclose return shipping label by mail with documents"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControlLabel
                control={<Checkbox />}
                label="Use WCS courier account for additional fee"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* LEFT COLUMN — Document Milestones */}
        <Grid size={{ xs: 12, md: 7 }}>
          {docs.map((doc) => (
            <Card
              key={doc.id}
              sx={{
                mb: 3,
                border: "1px solid #e0e0e0",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  borderColor: "#1976d2",
                },
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    {doc.country} — {doc.authority}
                  </Typography>
                  <Tooltip title="Remove document">
                    <IconButton
                      onClick={() => handleDelete(doc.id)}
                      size="small"
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Stepper */}
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Processing Stops & Timelines
                </Typography>
                <Stepper
                  alternativeLabel
                  activeStep={doc.timeline.length - 1}
                  connector={<CustomConnector />}
                >
                  {doc.timeline.map((step, idx) => (
                    <Step key={idx}>
                      <StepLabel StepIconComponent={CustomStepIcon}>
                        <Typography variant="body2" fontWeight={600}>
                          {step.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {step.sub}
                        </Typography>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>

                <Divider sx={{ my: 2 }} />

                {/* Fees */}
                <List dense disablePadding>
                  {doc.fees.map((f, idx) => (
                    <ListItem key={idx} sx={{ py: 0.5 }}>
                      <ListItemText primary={f.label} />
                      <Typography>${f.amount.toFixed(2)}</Typography>
                    </ListItem>
                  ))}
                  <Divider />
                  <ListItem>
                    <ListItemText primary="Total" />
                    <Typography fontWeight={700}>
                      ${doc.fees.reduce((a, b) => a + b.amount, 0).toFixed(2)}
                    </Typography>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          ))}
        </Grid>

        {/* RIGHT COLUMN — Order Summary & Payment */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Order Summary
              </Typography>
              <TextField
                label="Customer Name"
                fullWidth
                size="medium"
                sx={{ mb: 4 }}
                defaultValue="Raghvendra Roy"
              />
              <TextField
                label="Email Address"
                fullWidth
                size="medium"
                sx={{ mb: 4 }}
                defaultValue="raghvendra@redintegro.com"
              />
              <TextField
                label="Phone Number"
                fullWidth
                size="medium"
                sx={{ mb: 4 }}
                defaultValue="7987076459"
              />
              <TextField
                label="Billing Address"
                fullWidth
                size="medium"
                sx={{ mb: 4 }}
                defaultValue="146, 5-B, 3, TB, Aditya Nagar, Indore, MP-452010"
              />
              <TextField
                label="Return/Shipping Instructions"
                fullWidth
                size="small"
                multiline
                rows={2}
                defaultValue="Enclose Return Shipping Label by mail with documents"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Pay Now
              </Typography>
              <Typography variant="body2" mb={1}>
                Please select the type of Card:
              </Typography>
              <RadioGroup row defaultValue="credit">
                <FormControlLabel
                  value="debit"
                  control={<Radio />}
                  label="Debit"
                />
                <FormControlLabel
                  value="credit"
                  control={<Radio />}
                  label="Credit"
                />
              </RadioGroup>
              <Typography variant="caption" color="text.secondary">
                * 3.5% service charge applies to all debit and credit
                transactions.
              </Typography>

              <Box mt={2}>
                <TextField
                  label="Cardholder's Name"
                  fullWidth
                  size="small"
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Card Number"
                  fullWidth
                  size="small"
                  sx={{ mb: 2 }}
                />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextField label="Expiry (MM/YY)" fullWidth size="small" />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField label="CVV" fullWidth size="small" />
                  </Grid>
                </Grid>
                <FormControlLabel
                  control={<Checkbox />}
                  label="I have read and accepted the terms of use"
                  sx={{ mt: 1 }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 2,
                    py: 1,
                    backgroundColor: "#c30010",
                    "&:hover": { backgroundColor: "#a0000d" },
                  }}
                >
                  Pay ${totalAmount}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sticky Footer */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          bgcolor: "background.paper",
          p: 2,
          display: "flex",
          gap: 2,
          justifyContent: "flex-end",
          borderTop: "1px solid #ddd",
          mt: 3,
        }}
      >
        <Button variant="outlined" onClick={() => alert("Add more documents")}>
          Add More Documents
        </Button>
        <Button variant="contained" size="large">
          Checkout (USD {totalAmount})
        </Button>
      </Box>
    </Box>
  );
}
