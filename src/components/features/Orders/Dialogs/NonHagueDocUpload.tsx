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
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import DocumentUpload from "../Common/DocumentUpload";
import InputField from "@/components/ui/Input/Input";
import { CheckCircleOutline } from "@mui/icons-material";

function UploadDocs({
  country,
  documentType,
}: {
  country?: any;
  documentType?: any;
}) {
  const [isCorporateDocument, setIsCorporateDocument] = useState("");

  return (
    <Box>
      {country?.countryTypeId === 502 &&
        (country?.countryShortName === "UAE" ||
          country?.countryShortName === "Egypt") &&
        documentType === 522 && (
          <>
            <Typography
              variant="subtitle1"
              color="primary"
              fontWeight={"medium"}
            >
              Do you have Corporate or Personal Document?
            </Typography>
            <RadioGroup
              value={isCorporateDocument}
              onChange={(e) => setIsCorporateDocument(e.target.value)}
            >
              <Box sx={{ mb: 1 }}>
                <FormControlLabel
                  value="coporateDocument"
                  control={<Radio />}
                  label="Corporate document (CPP, CFG, CFS, LOA, Corporate POA, EC Cert, Good Standing Cert, and others)"
                />
              </Box>

              <Box sx={{ mb: 1 }}>
                <FormControlLabel
                  value="notCorporateDocument"
                  control={<Radio />}
                  label="Personal document (Degree, Diploma, Transcripts, FBI Background Check, Personal POA, Birth/Death/Marriage/Divorce Cert)"
                />
              </Box>
            </RadioGroup>
          </>
        )}
      <DocumentUpload country={country} />
    </Box>
  );
}

function AddPhotocopies() {
  const [value, setValue] = useState("");
  return (
    <Box>
      <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
        For Non-Hague countries, include 1 set of photocopies per document, or
        WCS will make required photocopies for the embassy’s file.
      </Typography>

      <Typography color="warning" sx={{ mb: 1 }}>
        *Would you like to include photocopies or WCS will make required
        photocopies?
      </Typography>

      <RadioGroup value={value} onChange={(e) => setValue(e.target.value)}>
        <Box sx={{ mb: 1 }}>
          <FormControlLabel
            value="photocopiesIncluded"
            control={<Radio />}
            label="Photocopies Included"
          />
        </Box>

        <Box sx={{ mb: 1 }}>
          <FormControlLabel
            value="photocopiesNotIncluded"
            control={<Radio />}
            label="WCS will make required photocopies for additional charge (WCS will print and process attached document. Photocopies charges are applicable at $1/page)."
          />
        </Box>
      </RadioGroup>
      {value === "photocopiesNotIncluded" ? (
        <InputField size="small" placeholder="Approximate number of pages" />
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

function ShippingCoCI({
  onValidate,
}: {
  onValidate: (valid: boolean) => void;
}) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (value === "yes") onValidate(true);
    else onValidate(false);
  }, [value]);

  return (
    <Box>
      <Typography variant="h6" color="primary">
        Certificate of Origin and Commercial Invoice
      </Typography>

      <Typography color="warning" sx={{ mb: 2 }}>
        For Shipping documents, UAE Embassy requires us to provide at least a
        Certificate of Origin(CO) and Commercial Invoice(CI).
      </Typography>

      <Typography>
        Do you have a Certificate of Origin and Commercial Invoice ?
      </Typography>

      <RadioGroup value={value} onChange={(e) => setValue(e.target.value)}>
        <Box>
          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        </Box>

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
          This country requires a Certificate of Origin and Commercial Invoice
          be presented for legalization of shipping documents
        </Typography>
      ) : null}
    </Box>
  );
}

function NotarizedFromSecretaryOfState({
  onValidate,
  country,
}: {
  onValidate: (valid: boolean) => void;
  country: any;
}) {
  const [isNotarized, setIsNotarized] = useState("");
  const [otherState, setOtherState] = useState("");
  const [certificationObtainedFromUS, setCertificationObtainedFromUS] =
    useState("");
  const [docOriginFromSelectiveStates, setDocOriginFromSelectiveStates] =
    useState("");

  useEffect(() => {
    if (isNotarized === "yes") onValidate(true);
    else onValidate(false);
  }, [isNotarized]);

  return (
    <Box>
      <Typography variant="h6" color="primary">
        *Have you notarized and certified the document from your in-state
        Secretary of State ?
      </Typography>

      <Typography color="warning">
        For this country, all general/personal documents must be notarized and
        certified by the Secretary of State in the state of origin
      </Typography>

      <RadioGroup
        value={isNotarized}
        onChange={(e) => setIsNotarized(e.target.value)}
      >
        <Box>
          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        </Box>

        <Box sx={{ mb: 1 }}>
          <FormControlLabel value="no" control={<Radio />} label="No" />
        </Box>
      </RadioGroup>

      {country?.countryShortName == "Lebanon" ? (
        <>
          <Typography variant="h6" color="primary">
            Does your document originate from the following states ?
          </Typography>

          <Typography color="warning">
            {country?.countryShortName == "Qatar"
              ? "Washington DC, Maryland, Virginia, North Carolina, South Carolina, North Dakota, Nebraska, West Virginia, Arkansas, Kentucky, Delaware, South Dakota, Puerto Rico."
              : "Maryland, Virginia, North Carolina, South Carolina, Georgia, Louisiana, Mississippi, Arkansas, Oklahoma, Texas, Alabama, Washington DC, Tennessee, Florida, Wyoming, Puerto Rico."}
          </Typography>

          <RadioGroup
            value={docOriginFromSelectiveStates}
            onChange={(e) => setDocOriginFromSelectiveStates(e.target.value)}
          >
            <Box>
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            </Box>

            <Box sx={{ mb: 1 }}>
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </Box>
          </RadioGroup>
        </>
      ) : (
        <>
          <Typography variant="h6" color="primary">
            Does your document originate from the other states ?
          </Typography>

          <RadioGroup
            value={otherState}
            onChange={(e) => setOtherState(e.target.value)}
          >
            <Box>
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            </Box>

            <Box sx={{ mb: 1 }}>
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </Box>
          </RadioGroup>
        </>
      )}
      <Typography variant="h6" color="primary">
        *Have you obtained certification from the U.S. Department of State ?
      </Typography>

      <RadioGroup
        value={certificationObtainedFromUS}
        onChange={(e) => setCertificationObtainedFromUS(e.target.value)}
      >
        <Box>
          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        </Box>

        <Box sx={{ mb: 1 }}>
          <FormControlLabel value="no" control={<Radio />} label="No" />
        </Box>
      </RadioGroup>

      {isNotarized === "no" ? (
        <Typography
          sx={{
            backgroundColor: "secondary.main",
            px: 2,
            py: 1,
            borderRadius: 2,
          }}
          color="white"
        >
          Please have document notarized by the Secretary of State in the state
          where the document was created. You can then reach out to us for
          further processing.
        </Typography>
      ) : null}
    </Box>
  );
}

function DocumentOrigin({
  onValidate,
}: {
  onValidate: (valid: boolean) => void;
}) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (value === "yes") onValidate(true);
    else onValidate(false);
  }, [value]);

  return (
    <Box>
      <Typography variant="h6" color="primary">
        Does your document originate from the following states ?
      </Typography>

      <Typography color="warning" sx={{ mb: 2 }}>
        Delaware, Florida, Georgia, Maryland, North Carolina, South Carolina,
        Virginia, Washington DC, West Virginia, Washington
      </Typography>

      <RadioGroup value={value} onChange={(e) => setValue(e.target.value)}>
        <Box>
          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        </Box>

        <Box sx={{ mb: 1 }}>
          <FormControlLabel value="no" control={<Radio />} label="No" />
        </Box>
      </RadioGroup>
    </Box>
  );
}

export default function NonHagueDocUpload({
  open,
  setOpen,
  country,
  documentType,
  onStepsAvailableChange,
}: {
  open: any;
  setOpen: any;
  country?: any;
  documentType?: number;
  onStepsAvailableChange?: (hasSteps: boolean) => void;
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
    country?.countryTypeId === 502 &&
    country?.isShipping == 1 &&
    documentType === 523
      ? {
          label: "Certificate of origin",
          component: ShippingCoCI,
          props: { onValidate: setShouldProceed },
        }
      : null,

    (country?.countryShortName == "Kurdistan" ||
      country?.countryShortName == "Lebanon" ||
      country?.countryShortName == "Qatar") &&
    documentType === 522
      ? {
          label: "Notarized from In-State SOS",
          component: NotarizedFromSecretaryOfState,
          props: { onValidate: setShouldProceed, country },
        }
      : null,

    country?.countryShortName == "Egypt" && documentType === 522
      ? {
          label: "Document Origin",
          component: DocumentOrigin,
          props: { onValidate: setShouldProceed },
        }
      : null,
  ].filter(Boolean) as {
    label: string;
    component: React.ComponentType<any>;
    props?: any;
  }[];

  // ✅ Notify parent whether steps exist
  useEffect(() => {
    onStepsAvailableChange?.(steps.length > 0);
  }, [steps.length, onStepsAvailableChange]);

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

  if (!steps.length) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 550,
          maxHeight: "100vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
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
              variant="contained"
              onClick={handleNext}
              disabled={!shouldProceed}
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
