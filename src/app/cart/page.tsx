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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter } from "next/navigation";

interface FeeItem {
  label: string;
  amount: number;
}

interface TimelineStep {
  label: string;
  sub: string;
  icon: React.ReactNode;
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

const dummyDocs: DocumentGroup[] = [
  {
    id: "1",
    country: "Albania",
    authority: "General",
    timeline: [
      {
        label: "Secretary of State",
        sub: "7 business days",
        icon: <WorkOutlineIcon />,
      },
      {
        label: "Estimated Completion",
        sub: "Oct 13, 2025",
        icon: <ScheduleIcon />,
      },
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
      {
        label: "U.S. Department of State",
        sub: "20 business days",
        icon: <WorkOutlineIcon />,
      },
      { label: "Embassy", sub: "7 business days", icon: <WorkOutlineIcon /> },
      {
        label: "Estimated Completion",
        sub: "Nov 12, 2025",
        icon: <ScheduleIcon />,
      },
    ],
    fees: [
      { label: "USDOS Authentication", amount: 20 },
      { label: "Afghanistan Legalization", amount: 125 },
      { label: "Money Order Fee", amount: 10 },
      { label: "WCS Service Fee", amount: 110 },
    ],
  },
];

export default function CartPage() {
  const [docs, setDocs] = useState(dummyDocs);
  const router = useRouter();

  const handleDelete = (id: string) => {
    setDocs(docs.filter((d) => d.id !== id));
  };

  const totalAmount = docs
    .reduce((sum, d) => sum + d.fees.reduce((fSum, f) => fSum + f.amount, 0), 0)
    .toFixed(2);

  const checkout = () => {
    router.push("/cart/payment");
  };

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
          height: "100%",
          cursor: "pointer",
          transition: "all 0.3s ease",
          border: "1px solid #e0e0e0",
          mb: 3,
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Shipping Label / Return Instructions
          </Typography>
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

      {/* Documents */}
      {docs.map((doc) => (
        <Card
          key={doc.id}
          sx={{
            height: "100%",
            cursor: "pointer",
            transition: "all 0.3s ease",
            border: "1px solid #e0e0e0",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              borderColor: "#1976d2",
            },
            mb: 3,
          }}
        >
          <CardContent>
            {/* Header */}
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
                <IconButton onClick={() => handleDelete(doc.id)} size="small">
                  <DeleteIcon color="error" />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Stepper for Timeline */}
            <Box sx={{ mb: 3 }}>
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
            </Box>

            <Divider sx={{ my: 1 }} />

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
        }}
      >
        <Button variant="outlined" onClick={() => alert("Add more documents")}>
          Add More Documents
        </Button>
        <Button variant="contained" size="large" onClick={checkout}>
          Checkout (USD {totalAmount})
        </Button>
      </Box>
    </Box>
  );
}
