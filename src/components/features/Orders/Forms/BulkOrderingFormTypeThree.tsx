"use client";

import React, { useState } from "react";
import {
  Grid,
  Checkbox,
  FormControl,
  InputLabel,
  OutlinedInput,
  Box,
  FormGroup,
  FormControlLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
} from "@mui/material";

import FormLayout from "@/components/ui/Forms/FormLayout";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import CountrySelect from "@/components/ui/Dropdown/CountryDropdown";
import InputField from "@/components/ui/Input/Input";
import FileUploadField from "@/components/ui/Input/FileInput";
import { AdditionalServices } from "@/dataset/constants/constants";
import DocumentDropdown, {
  DocType,
} from "@/components/ui/Dropdown/DocumentDropdown";
import DocumentUpload from "../Common/DocumentUpload";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import MultiDocumentUpload from "../Common/MultiDocumentUpload";

const mockDocuments = ["Passport", "Certificate", "License"];

interface UploadedDoc {
  type: string;
  file: File | null;
}

type CountryName = string;
type DocumentType = string;

interface UploadEntry {
  file: File | null;
  services: string[];
}

type UploadsState = Record<CountryName, Record<DocumentType, UploadEntry>>;

export default function BulkOrderingFormTypeThree() {
  const [countries, setCountries] = useState<any>([]);
  const [documents, setDocuments] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string[]>>({});
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [country, setCountry] = useState<any>();
  const [document, setDocument] = useState<DocType | null>(null);
  const [uploads, setUploads] = useState<UploadsState>({});
  const { documentTypes } = useSelector((state: RootState) => state.formsData);
  const documentOptions = documentTypes.map((d: any) => d?.docTypeName);

  const [additionalServices, setAdditionalServices] = useState<string[]>([]);
  const [additionalServicesState] = useState(AdditionalServices);
  const [disabled] = useState(false);

  console.log(documentOptions);

  const toggleMapping = (country: string, doc: string) => {
    setMapping((prev) => {
      const existing = prev[country] || [];
      return {
        ...prev,
        [country]: existing.includes(doc)
          ? existing.filter((d) => d !== doc)
          : [...existing, doc],
      };
    });
  };

  const openUploadDialog = () => {
    const initialUploads: UploadsState = {};

    Object.entries(mapping).forEach(([country, docs]) => {
      if (!docs.length) return;

      initialUploads[country] = {};
      docs.forEach((doc) => {
        initialUploads[country][doc] = {
          file: null,
          services: [],
        };
      });
    });

    setUploads(initialUploads);
    setDialogOpen(true);
  };

  const handleFileChange = (index: number, file: File | null) => {
    const updated = [...uploadedDocs];
    updated[index].file = file;
    setUploadedDocs(updated);
  };

  const handleDocumentSelect = (newValue: DocType | null) => {
    if (!newValue) return;
  };

  console.log(documents);

  return (
    <FormLayout title="Bulk Ordering - Add multiple documents for multiple countries.">
      <Grid container spacing={2}>
        {/* Countries */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <CountrySelect
            label="Select Countries"
            value={countries}
            onChange={setCountries}
            multiple
            disabledCountryIds={[
              3, 53, 82, 88, 93, 97, 130, 144, 196, 199, 205,
            ]}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Dropdown
            label="Select Documents *"
            options={documentOptions}
            value={documents as any}
            onChange={(v: any) => setDocuments(v)}
            multiple
          />
        </Grid>

        {/* Mapping Table */}
        {countries.length > 0 && documents.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
              Map Documents to Countries
            </Typography>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Country</TableCell>
                  {documents.map((doc) => (
                    <TableCell key={doc} align="center">
                      {doc}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {countries.map((country: any) => {
                  const countryName = country?.countryShortName;

                  return (
                    <TableRow key={countryName}>
                      <TableCell>{countryName}</TableCell>
                      {documents.map((doc) => (
                        <TableCell key={doc} align="center">
                          <Checkbox
                            checked={
                              mapping[countryName]?.includes(doc) || false
                            }
                            onChange={() => toggleMapping(countryName, doc)}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Grid>
        )}

        {/* Upload Button */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Button
            variant="outlined"
            fullWidth
            sx={{ height: 56 }}
            disabled={documents.length === 0}
            onClick={openUploadDialog}
          >
            Upload Selected Documents
          </Button>
        </Grid>

        {/* Additional Comments */}
        <Grid size={{ xs: 12 }}>
          <InputField
            label="Additional Comments"
            multiline
            minRows={6}
            placeholder="Enter comments..."
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Alert severity="warning" sx={{ alignItems: "center" }}>
            Bulk ordering is not supported for the following countries:
            <Box component="span" sx={{ fontWeight: 600 }}>
              {" "}
              Algeria, Egypt, Iraq, Jordan, Kuwait, Lebanon, Nigeria, Qatar,
              Yemen, Taiwan, and Kurdistan.
            </Box>
          </Alert>
        </Grid>
      </Grid>

      {/* Upload Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Upload Documents</DialogTitle>
        <DialogContent dividers>
          {Object.entries(uploads).map(([country, docs]) => (
            <Box key={country} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                {country}
              </Typography>

              {Object.entries(docs).map(([docType, docData]) => (
                <Grid
                  key={docType}
                  container
                  spacing={2}
                  sx={{
                    mb: 2,
                    p: 2,
                    border: "1px solid",
                    borderColor: "grey.300",
                    borderRadius: 2,
                  }}
                >
                  <Grid size={{ xs: 12 }}>
                    <Typography fontWeight={600}>{docType}</Typography>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    {/* <DocumentUpload
                      onChange={(file) =>
                        setUploads((prev) => ({
                          ...prev,
                          [country]: {
                            ...prev[country],
                            [docType]: {
                              ...prev[country][docType],
                              file,
                            },
                          },
                        }))
                      }
                    /> */}
                    <MultiDocumentUpload />
                  </Grid>

                  {/* Additional Services - single line on desktop, wraps only on mobile */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1,
                          height: 56,
                          display: "flex",
                          alignItems: "center",
                          px: 1.25,
                          "&:hover fieldset": {
                            borderColor: "rgba(0,0,0,0.12)",
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
                              height: "100%",
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
                                      checked={additionalServices.includes(
                                        service
                                      )}
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

                    <Grid mt={3}>
                      <InputField
                        label="Customer Reference"
                        onChange={(e) => console.log(e)}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Box>
          ))}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setDialogOpen(false)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </FormLayout>
  );
}
