"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Autocomplete,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import DocumentUpload from "../Common/DocumentUpload";
import CountrySelect from "@/components/ui/Dropdown/CountryDropdown";
import { CheckCircleOutline } from "@mui/icons-material";

const couriers = ["FEDEX", "UPS", "USPS", "DHL", "OTHERS"];

function UploadDocs({ country }: { country: any }) {
  const [docMailToWCS, setDocMailToWCS] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courier, setCourier] = useState<string | null>(null);

  return (
    <>
      {country?.countryShortName == "China" ? (
        <Box>
          <Typography variant="h6" color="primary">
            *WCS requires original documents for China . Please mail the
            original to WCS office.
          </Typography>
          <RadioGroup
            value={docMailToWCS}
            onChange={(e) => setDocMailToWCS(e.target.value)}
          >
            <FormControlLabel
              value="docMailToWCS"
              control={<Radio />}
              label="Original document will be mailed to WCS office"
            />
          </RadioGroup>
          {docMailToWCS === "docMailToWCS" && (
            <Box sx={{ pl: 4, display: "flex", gap: 1, flexWrap: "wrap" }}>
              <TextField
                label="Tracking number to WCS"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                size="small"
                sx={{ flex: 1 }}
              />
              <Autocomplete
                options={couriers}
                value={courier}
                onChange={(_, newValue) => setCourier(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Courier" size="small" />
                )}
                sx={{ flex: 1 }}
              />
            </Box>
          )}
        </Box>
      ) : (
        <DocumentUpload country={country} />
      )}
    </>
  );
}

function NotarizedFromUSAddress({
  onValidate,
}: {
  onValidate: (valid: boolean) => void;
}) {
  const [value, setValue] = useState("");
  const [country, setCountry] = useState<any>(null);

  useEffect(() => {
    if (value === "yes") onValidate(true);
    else onValidate(false);
  }, [value]);

  return (
    <Box>
      <Typography variant="h6" color="primary">
        *Have you signed and notarized the document from the U.S address
        mentioned on the document?
      </Typography>

      <RadioGroup value={value} onChange={(e) => setValue(e.target.value)}>
        <Box sx={{ mb: 1 }}>
          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        </Box>

        {value === "yes" ? (
          <>
            <Typography sx={{ mb: 2 }}>
              Please select the state of origin of the document from the
              drop-down menu.
            </Typography>
            <CountrySelect value={country} onChange={setCountry} />
          </>
        ) : null}

        <Box sx={{ mb: 1 }}>
          <FormControlLabel value="no" control={<Radio />} label="No" />
        </Box>
      </RadioGroup>
      {value === "no" ? (
        <Typography
          sx={{
            backgroundColor: "secondary.main",
            px: 2,
            py: 1,
            borderRadius: 2,
          }}
          color="white"
        >
          Please have your document signed and notarized from the U.S address
          mentioned on the document. You can then reach out to us for further
          processing.
        </Typography>
      ) : null}
    </Box>
  );
}

function Confirmation() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <CheckCircleOutline sx={{ fontSize: 60, color: "#28A745" }} />

      <Typography variant="h5" sx={{ fontWeight: 600, color: "#1B263B" }}>
        Submission Successful!
      </Typography>

      <Typography
        align="center"
        variant="body1"
        sx={{ color: "#475569", maxWidth: 500 }}
      >
        Your submission has been received successfully. Please proceed with the
        rest of the form to complete your application.
      </Typography>
    </Box>
  );
}

export default function HagueDocUpload({
  open,
  setOpen,
  country,
  documentType,
}: {
  open: any;
  setOpen: any;
  country?: any;
  documentType?: number;
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [shouldProceed, setShouldProceed] = useState(true);

  const [values, setValues] = useState({
    uploadType: null,
    file: null,
    numPages: "",
    trackingNumber: "",
    courier: null,
  });

  const steps = [
    country?.countryShortName == "China" && {
      label: "Notarized from US Address",
      component: NotarizedFromUSAddress,
      props: { onValidate: setShouldProceed },
    },
    {
      label: "Document Upload",
      component: UploadDocs,
      props: { country, documentType },
    },
    { label: "Confirmation", component: Confirmation, props: { values } },
  ].filter(Boolean) as {
    label: string;
    component: React.ComponentType<any>;
    props?: any;
  }[];

  const handleNext = () => {
    setActiveStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const handleBack = () => {
    setActiveStep((s) => Math.max(s - 1, 0));
  };
  const handleClose = () => {
    setActiveStep(0);
    setValues({
      uploadType: null,
      file: null,
      numPages: "",
      trackingNumber: "",
      courier: null,
    });
    setOpen(false);
  };
  const handleSubmit = () => {
    // Submit logic goes here
    console.log(values);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          width: 550,
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          mx: "auto",
          mt: "8%",
          boxShadow: 24,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 2 }}>
          {steps.map(({ label }) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 1, minHeight: 160 }}>
          {(() => {
            const StepComponent = steps[activeStep].component;
            const stepProps = steps[activeStep].props || {};
            return <StepComponent {...stepProps} />;
          })()}
        </Box>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}
        >
          {activeStep === 0 && (
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
          )}
          {activeStep > 0 && (
            <Button variant="text" onClick={handleBack}>
              Back
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button
              disabled={!shouldProceed}
              variant="contained"
              onClick={handleNext}
            >
              Next
            </Button>
          ) : (
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
