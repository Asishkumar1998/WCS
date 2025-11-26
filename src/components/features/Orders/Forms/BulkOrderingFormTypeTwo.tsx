"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  OutlinedInput,
  Box,
} from "@mui/material";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import InputField from "@/components/ui/Input/Input";
import FileUploadField from "@/components/ui/Input/FileInput";
import FormLayout from "@/components/ui/Forms/FormLayout";
import { AdditionalServices, Services } from "@/dataset/constants/constants";
import CountrySelect from "@/components/ui/Dropdown/CountryDropdown";

const mockDocuments = ["Passport", "Certificate", "License"];
const payments = ["Credit Card", "PayPal", "Bank Transfer"];

interface DocumentEntry {
  type: string;
  file: File | null;
  reference: string;
}

export default function BulkOrderingFormTypeTwo() {
  const [country, setCountry] = useState<any>(null);
  const [documents, setDocuments] = useState<string[]>([]);
  const [service, setService] = useState("");
  const [additionalServices, setAdditionalServices] = useState<string[]>([]);
  const [payment, setPayment] = useState("");

  const [docEntries, setDocEntries] = useState<DocumentEntry[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [additionalServicesState, setAdditionalServicesState] =
    useState(AdditionalServices);
  const [disabled, setDisabled] = useState(false);

  // When docs are chosen in dropdown and user clicks upload
  const openDialogForDocs = () => {
    const entries = documents.map((doc) => ({
      type: doc,
      file: null,
      reference: "",
    }));
    setDocEntries(entries);
    setDialogOpen(true);
  };

  const handleFileChange = (index: number, file: File | null) => {
    const updated = [...docEntries];
    updated[index].file = file;
    setDocEntries(updated);
  };

  const handleReferenceChange = (index: number, value: string) => {
    const updated = [...docEntries];
    updated[index].reference = value;
    setDocEntries(updated);
  };

  return (
    <FormLayout title="Bulk Ordering - Add multiple documents for a single country.">
      <Grid container spacing={2}>
        {/* Country */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <CountrySelect
            label="Select Country *"
            value={country}
            onChange={setCountry}
          />
        </Grid>

        {/* Document Types */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Dropdown
            label="Select Documents"
            options={mockDocuments}
            value={documents as any}
            onChange={(v: any) => setDocuments(v)}
            multiple
          />
        </Grid>

        {/* Upload Trigger */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={openDialogForDocs}
            disabled={documents.length === 0}
            sx={{
              width: "100%",
              height: 56,
              py: 1,
              "&.Mui-disabled": {
                color: "grey.500",
              },
            }}
          >
            Upload Selected Documents
          </Button>
        </Grid>

        {/* Service */}
        {/* <Grid size={{ xs: 12, sm: 6 }}>
          <Dropdown
            label="Select Service *"
            options={Services}
            value={service}
            onChange={setService}
          />
        </Grid> */}

        {/* Additional Service */}
        {/* <Grid size={{ xs: 12, sm: 6 }}>
          <Dropdown
            label="Additional Service"
            options={AdditionalServices}
            value={additionalServices}
            onChange={setAdditionalServices}
            multiple
          />
        </Grid> */}
        {/* Additional Services - single line on desktop, wraps only on mobile */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl
            fullWidth
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                height: 56, // same as TextField default
                display: "flex",
                alignItems: "center",
                px: 1.25,
                "&:hover fieldset": {
                  borderColor: "rgba(0,0,0,0.12)", // no hover highlight
                },
                "&.Mui-focused fieldset": {
                  borderColor: "rgba(0,0,0,0.12)",
                },
              },
            }}
          >
            <InputLabel shrink>Additional Services</InputLabel>

            <OutlinedInput
              notched
              label="Additional Services"
              inputComponent={() => (
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    overflowX: "auto",
                    height: "100%", // aligns vertically
                    pl: "6px",
                  }}
                >
                  <FormGroup
                    row
                    sx={{
                      flexWrap: { xs: "wrap", sm: "nowrap" },
                      justifyContent: "flex-start",
                      alignItems: "center",
                      "& .MuiFormControlLabel-root": {
                        flex: "0 0 auto",
                        whiteSpace: "nowrap",
                        "& .MuiTypography-root": {
                          fontSize: "0.9rem",
                        },
                        "& .MuiCheckbox-root": {
                          transform: "scale(0.9)",
                          p: "2px",
                        },
                      },
                    }}
                  >
                    {additionalServicesState.map((service) => (
                      <FormControlLabel
                        key={service}
                        control={
                          <Checkbox
                            checked={additionalServices.includes(service)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setAdditionalServices((prev) =>
                                checked
                                  ? [...prev, service]
                                  : prev.filter((s) => s !== service)
                              );
                            }}
                            disabled={disabled}
                          />
                        }
                        label={service}
                      />
                    ))}
                  </FormGroup>
                </Box>
              )}
              sx={{
                "& .MuiOutlinedInput-input": {
                  height: "auto",
                  padding: 0,
                },
              }}
            />
          </FormControl>
        </Grid> 

        {/* Additional Comments */}
        <Grid
          size={{ xs: 12 }}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <InputField
            label="Additional Comments"
            placeholder="Enter comments..."
            disabled={disabled}
            multiline
            minRows={9}
            sx={{
              height: "100%",
              "& .MuiOutlinedInput-root": {
                height: "100%",
                alignItems: "flex-start",
              },
              "& textarea": {
                height: "100% !important",
                resize: "none",
              },
            }}
          />
        </Grid>

        {/* Payment */}
        {/* <Grid size={{ xs: 12 }}>
          <Dropdown
            label="Payment Method *"
            options={payments}
            value={payment}
            onChange={setPayment}
          />
        </Grid> */}
      </Grid>

      {/* Popup for uploading + references */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Upload Documents & Enter References</DialogTitle>
        <DialogContent>
          {docEntries.length === 0 ? (
            <Typography color="text.secondary">
              No documents selected.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {docEntries.map((entry, index) => (
                <Grid
                  key={index}
                  container
                  spacing={2}
                  size={{ xs: 12 }}
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "grey.300",
                    borderRadius: 2,
                    mb: 2,
                    backgroundColor: "grey.50",
                  }}
                >
                  {/* Document Type Title */}
                  <Grid size={{ xs: 12 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{ mb: 1, color: "text.primary" }}
                    >
                      {entry.type}
                    </Typography>
                  </Grid>

                  {/* Upload + Reference Side by Side */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FileUploadField
                      label="Upload File"
                      onChange={(file) => handleFileChange(index, file)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <InputField
                      fullWidth
                      label="Customer Reference"
                      value={entry.reference}
                      placeholder="Enter reference"
                      onChange={(e) =>
                        handleReferenceChange(index, e.target.value)
                      }
                    />
                  </Grid>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => setDialogOpen(false)}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </FormLayout>
  );
}
