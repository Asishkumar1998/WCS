"use client";
import React, { useEffect, useState } from "react";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Collapse,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Modal from "@/components/ui/Modal/Modal";
import CountrySelect from "@/components/ui/Dropdown/CountryDropdown";

// ===== Custom Stepper Styles =====
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 22 },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.divider,
    borderRadius: 1,
  },
}));

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

// ===== Dummy Data =====
const dummyDocs = [
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
  const [paymentType, setPaymentType] = useState("payNow");
  const [checked, setChecked] = useState<{ option: string | null }>({
    option: null,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({
    region: "",
    contactName: "",
    company: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
    email: "",
  });
  const [country, setCountry] = useState<any>(null);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAdd = () => {};

  const handleDelete = (id: string) => setDocs(docs.filter((d) => d.id !== id));

  const totalAmount = docs
    .reduce((sum, d) => sum + d.fees.reduce((fSum, f) => fSum + f.amount, 0), 0)
    .toFixed(2);

  useEffect(() => {
    if (checked.option === "courier") setOpenDialog(true);
  }, [checked]);

  return (
    <Box sx={{ p: 3, bgcolor: "background.default", mt: "64px" }}>
      {/* ===== Shipping Section ===== */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        {/* Header Row */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          {/* Left title */}
          <Typography variant="subtitle1" fontWeight={600} color="text.primary">
            Shipping Label / Return Instructions
          </Typography>

          {/* Right-aligned Invoice Reference / PO Number */}
          <TextField
            label="Invoice Reference / PO Number"
            placeholder="Enter invoice reference or PO number"
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              maxWidth: 320,
              "& .MuiOutlinedInput-root": {
                height: 40,
                "& fieldset": {
                  borderColor: "#1976d2",
                },
                "&:hover fieldset": {
                  borderColor: "#1565c0",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1976d2",
                },
              },
            }}
          />
        </Box>

        {/* Radio Buttons */}
        <RadioGroup
          row
          value={checked.option}
          onChange={(e) => setChecked({ option: e.target.value })}
        >
          <FormControlLabel
            value="upload"
            control={<Radio size="small" />}
            label="Upload return shipping label"
          />
          <FormControlLabel
            value="mail"
            control={<Radio size="small" />}
            label="Enclose return shipping label by mail"
          />
          <FormControlLabel
            value="courier"
            control={<Radio size="small" />}
            label="Use WCS courier account"
          />
        </RadioGroup>

        {/* Collapsible Content */}
        <Collapse in={!!checked.option} timeout="auto">
          <Box mt={2} pl={4}>
            {checked.option === "upload" && (
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  * When creating a prepaid return label, please use your
                  company information (name, address, phone) as the
                  shipper/sender. Do Not use WCS information (name, address,
                  phone) as the shipper/sender.
                </Typography>
                <Box
                  mt={1}
                  p={2}
                  sx={{
                    border: "1px dashed",
                    borderColor: "divider",
                    borderRadius: 2,
                    textAlign: "center",
                    cursor: "pointer",
                    "&:hover": { borderColor: "primary.main" },
                  }}
                >
                  <Typography variant="body2" color="primary.main">
                    Click to upload
                  </Typography>
                </Box>
              </Box>
            )}

            {checked.option === "mail" && (
              <Typography variant="body2" color="text.secondary" mb={2}>
                * When creating a prepaid return label, please use your company
                information (name, address, phone) as the shipper/sender. Do Not
                use WCS information (name, address, phone) as the
                shipper/sender.
              </Typography>
            )}
          </Box>
        </Collapse>
      </Paper>

      <Grid container spacing={3}>
        {/* ===== LEFT COLUMN - Documents ===== */}
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

        {/* ===== RIGHT COLUMN - Sticky Sidebar ===== */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box
            sx={{
              position: { md: "sticky" },
              top: "80px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Order Summary Accordion */}
            <Accordion defaultExpanded sx={{ borderRadius: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight={600}>Order Summary</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  label="Customer Name"
                  fullWidth
                  size="small"
                  sx={{ mb: 3 }}
                  defaultValue="Raghvendra Roy"
                  InputProps={{
                    readOnly: true, // 🔹 makes the input read-only
                  }}
                />
                <TextField
                  label="Email Address"
                  fullWidth
                  size="small"
                  sx={{ mb: 3 }}
                  defaultValue="raghvendra@redintegro.com"
                  InputProps={{
                    readOnly: true, // 🔹 makes the input read-only
                  }}
                />
                <TextField
                  label="Phone Number"
                  fullWidth
                  size="small"
                  sx={{ mb: 3 }}
                  defaultValue="7987076459"
                  InputProps={{
                    readOnly: true, // 🔹 makes the input read-only
                  }}
                />
                <TextField
                  label="Billing Address"
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  sx={{ mb: 3 }}
                  defaultValue="146, 5-B, 3, TB, Aditya Nagar, Indore, MP-452010"
                  InputProps={{
                    readOnly: true, // 🔹 makes the input read-only
                  }}
                />
              </AccordionDetails>
            </Accordion>

            {/* Payment Card */}
            <Card sx={{ borderRadius: 2, p: 3 }}>
              <Typography fontWeight={600} mb={2}>
                Payment Options
              </Typography>

              <RadioGroup
                row
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
              >
                <FormControlLabel
                  value="card"
                  control={<Radio />}
                  label="Card"
                />
                <FormControlLabel
                  value="check"
                  control={<Radio />}
                  label="Check"
                />
                <FormControlLabel
                  value="wire"
                  control={<Radio />}
                  label="Wire/ACH Transfer"
                />
                <FormControlLabel
                  value="purchase-order"
                  control={<Radio />}
                  label="Pay with Purchase Order (PO)"
                />
              </RadioGroup>

              {paymentType === "card" && (
                <>
                  <Typography variant="body2" mt={1} mb={2}>
                    * 3.5% service charge applies to all card transactions.
                  </Typography>

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
                      <TextField
                        label="Expiry (MM/YY)"
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField label="CVV" fullWidth size="small" />
                    </Grid>
                  </Grid>
                </>
              )}

              <FormControlLabel
                control={<Checkbox />}
                label="I accept the terms of use"
                sx={{ mt: 1 }}
              />

              <Divider sx={{ my: 2 }} />

              <Box display="flex" gap={1.5} flexWrap="wrap">
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => alert("Add more documents")}
                >
                  Add More Documents
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    backgroundColor:
                      paymentType === "payLater" ? "#1976d2" : "#c30010",
                    "&:hover": {
                      backgroundColor:
                        paymentType === "payLater" ? "#115293" : "#a0000d",
                    },
                  }}
                >
                  {paymentType === "payLater"
                    ? "Confirm Pay Later"
                    : `Pay $${totalAmount}`}
                </Button>
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>
      <Modal
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        title="Add New WCS Courier Address"
        type="custom"
        showActions={false} // we handle buttons inside children
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* <TextField
              label="Country"
              fullWidth
              size="small"
              value={form.country}
              onChange={(e) => handleChange("country", e.target.value)}
            /> */}
            <CountrySelect
              label="Select Country *"
              value={country}
              onChange={setCountry}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Region"
              fullWidth
              size="medium"
              value={form.region}
              onChange={(e) => handleChange("region", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Contact Name"
              fullWidth
              size="medium"
              value={form.contactName}
              onChange={(e) => handleChange("contactName", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Company"
              fullWidth
              size="medium"
              value={form.company}
              onChange={(e) => handleChange("company", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Address"
              fullWidth
              size="medium"
              multiline
              rows={2}
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="City"
              fullWidth
              size="medium"
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="State"
              fullWidth
              size="medium"
              value={form.state}
              onChange={(e) => handleChange("state", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Postal Code"
              fullWidth
              size="medium"
              value={form.postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Phone Number"
              fullWidth
              size="medium"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Email Address"
              fullWidth
              size="medium"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </Grid>
        </Grid>

        <Box display="flex" gap={2} mt={3} flexWrap="wrap">
          <Button variant="contained" color="primary" onClick={handleAdd}>
            Add Address
          </Button>
          <Button variant="outlined" onClick={() => {}}>
            Use Existing Address
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
