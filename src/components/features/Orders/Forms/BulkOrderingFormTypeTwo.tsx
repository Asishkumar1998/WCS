"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import FormLayout from "@/components/ui/Forms/FormLayout";
import { AdditionalServices } from "@/dataset/constants/constants";
import CountrySelect from "@/components/ui/Dropdown/CountryDropdown";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import AdditionalQuestions from "../Common/AdditionalQuestions";
import {
  createUSApostilleOrder,
  getStates,
  uploadFile,
} from "@/services/formsService";
import MultiDocumentUpload from "../Common/MultiDocumentUpload";
import { useSnackbar } from "@/components/ui/Snakebar/SnackbarProvider";
import OverlayLoader from "@/components/ui/Loader/OverlayLoader";
import validateUSApostilleForm from "../Common/validateUSForm";
import buildBulkMultiDocSingleCountryPayload from "../Common/BulkOrderType2Payload";
import { CART_SERVICE_MAP } from "@/constants/serviceMap";
import { getOrderIdOfCart } from "@/services/cartServices";
import { deleteOrder } from "@/services/deleteService";
import { getAuth } from "@/app/utils/auth";
import ADDITIONAL_QUESTION_COUNTRY_MAP from "@/dataset/additionalQuesWithCountryMap";

interface DocumentType {
  docTypeId: number;
  docTypeName: string;
  attachmentRequired: boolean;
  physicalRequired: boolean;
  docCategoryId?: number;
}

interface uploadDataType {
  uploadedFiles: File[];
  nestedSelection: "proceedWithAttached" | "originalMailedNested" | null;
  numPages: string;
  trackingNumberNested: string;
  courierNested: string | null;
}

interface DocumentEntry {
  docTypeId: number;
  type: string;
  docCategoryId?: number;
  attachmentRequired: boolean;
  physicalRequired: boolean;
  uploadData: uploadDataType[];
  reference: string[];
  uploadedAttachments?: any[];
  instructions?: string[];
}

export default function BulkOrderingFormTypeTwo() {
  const [country, setCountry] = useState<any>(null);
  const [documents, setDocuments] = useState<number[]>([]);
  const [additionalServices, setAdditionalServices] = useState<string[]>([]);
  const [generalAdditionalQuestions, setGeneralAdditionalQuestions] = useState<any[]>([]);
  const [states, setStates] = useState<any>();
  const [additionalComments, setAdditionalComments] = useState("");
  const [loader, setLoader] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState("");
  const [showCartConflict, setShowCartConflict] = useState(false);
  const [existingOrderId, setExistingOrderId] = useState<number | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [docEntries, setDocEntries] = useState<DocumentEntry[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [additionalServicesState] = useState(AdditionalServices);
  const [disabled, setDisabled] = useState(false);

  const [numDocs, setNumDocs] = useState<string[]>([]);

  const { documentTypes } = useSelector((state: RootState) => state.formsData);
  const { showSnackbar } = useSnackbar();

  const clearFieldErrors = (...keys: string[]) => {
    setFieldErrors((prev) => {
      if (keys.length === 0) return {};
      const next = { ...prev };
      keys.forEach((key) => delete next[key]);
      return next;
    });
  };

  const PINNED_DOC_IDS = [78, 35, 36];
  const numberOptions = ["1", "2", "3", "4", "5"];

  const documentOptions = useMemo(() => {
    const filteredDocs = documentTypes;

    const pinned = PINNED_DOC_IDS.map((id) =>
      filteredDocs.find((d) => d.docTypeId === id),
    )
      .filter((d): d is DocumentType => Boolean(d))
      .map((d) => d.docTypeName);

    const rest = filteredDocs
      .filter((d) => !PINNED_DOC_IDS.includes(d.docTypeId))
      .sort((a, b) => a.docTypeName.localeCompare(b.docTypeName))
      .map((d) => d.docTypeName);

    return [...pinned, ...rest];
  }, [documentTypes]);

  const pinnedDocumentNames = useMemo(() => {
    return documentTypes
      .filter((d) => PINNED_DOC_IDS.includes(d.docTypeId))
      .map((d) => d.docTypeName);
  }, [documentTypes]);

  const chosenDocs = useMemo(
    () =>
      documents
        .map((id) => documentTypes.find((d) => d.docTypeId === id))
        .filter((doc): doc is DocumentType => !!doc),
    [documents, documentTypes],
  );

  useEffect(() => {
    if (chosenDocs.length === 0) return;
    setNumDocs((prev) => {
      const next = chosenDocs.map((_, i) => prev[i] ?? "1");
      return next;
    });
  }, [chosenDocs.length]);

  const generalDocs = useMemo(
    () => chosenDocs.filter((doc) => doc.docCategoryId === 522),
    [chosenDocs],
  );

  const generalDocNames = useMemo(
    () => generalDocs.map((doc) => doc.docTypeName),
    [generalDocs],
  );

  const shouldRenderGeneralAdditionalQuestions = useMemo(() => {
    if (!country?.countryId) return false;
    const mappedQuestions = ADDITIONAL_QUESTION_COUNTRY_MAP[country.countryId];
    return (
      generalDocs.length > 0 &&
      Array.isArray(mappedQuestions) &&
      mappedQuestions.length > 0
    );
  }, [country?.countryId, generalDocs.length]);

  const openDialogForDocs = () => {
    setDocEntries((prev) => {
      const existingByDocTypeId = new Map(
        prev.map((entry) => [entry.docTypeId, entry]),
      );

      return chosenDocs.map((doc, index) => {
        const existing = existingByDocTypeId.get(doc.docTypeId);
        const count = Number(numDocs[index] ?? "1");

        if (existing) {
          // Preserve existing upload slots; add empty slots if count grew
          const uploads = [...existing.uploadData];
          while (uploads.length < count) {
            uploads.push({
              uploadedFiles: [],
              nestedSelection: null,
              numPages: "",
              trackingNumberNested: "",
              courierNested: null,
            });
          }
          return { ...existing, uploadData: uploads };
        }

        const uploadData: uploadDataType[] = Array.from({ length: count }, () => ({
          uploadedFiles: [],
          nestedSelection: null,
          numPages: "",
          trackingNumberNested: "",
          courierNested: null,
        }));

        return {
          docTypeId: doc.docTypeId,
          type: doc.docTypeName,
          docCategoryId: doc.docCategoryId,
          attachmentRequired: doc.attachmentRequired,
          physicalRequired: doc.physicalRequired,
          uploadData,
          reference: [],
          instructions: [],
        };
      });
    });

    setDialogOpen(true);
  };

  const handleNumDocsChange = (index: number, value: string) => {
    const newCount = Number(value);

    setNumDocs((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });

    setDocEntries((prev) => {
      const updated = [...prev];
      const entry = { ...updated[index] };
      const uploads = [...entry.uploadData];

      // Grow: add empty slots
      while (uploads.length < newCount) {
        uploads.push({
          uploadedFiles: [],
          nestedSelection: null,
          numPages: "",
          trackingNumberNested: "",
          courierNested: null,
        });
      }
      // Shrink: trim extras (preserves data for slots that remain)
      uploads.length = newCount;

      entry.uploadData = uploads;
      updated[index] = entry;
      return updated;
    });
  };

  const handleUploadDataChange = (index: number, docIndex: number, data: any) => {
    clearFieldErrors("uploadEntries");
    setDocEntries((prev) => {
      const updated = [...prev];
      const entry = { ...updated[index] };
      const uploads = [...entry.uploadData];

      uploads[docIndex] = {
        uploadedFiles: data?.uploadedFiles ?? [],
        nestedSelection: data?.nestedSelection ?? null,
        numPages: data?.numPages ?? "",
        trackingNumberNested: data?.trackingNumberNested ?? "",
        courierNested: data?.courierNested ?? null,
      };
      entry.uploadData = uploads;
      updated[index] = entry;
      return updated;
    });
  };

  const handleReferenceChange = (index: number, docIndex: number, value: string) => {
    setDocEntries((prev) => {
      const updated = [...prev];
      const entry = { ...updated[index] };
      const refs = Array.isArray(entry.reference) ? [...entry.reference] : [];
      refs[docIndex] = value;
      entry.reference = refs;
      updated[index] = entry;
      return updated;
    });
  };

  const handleAdditionalDataChange = (index: number, docIndex: number, value: any) => {
    setDocEntries((prev) => {
      const updated = [...prev];
      const entry = { ...updated[index] };
      const ints = Array.isArray(entry.instructions) ? [...entry.instructions] : [];
      ints[docIndex] = value;
      entry.instructions = ints;
      updated[index] = entry;
      return updated;
    });
  };

  const validateUploadEntries = () => {
    if (docEntries.length === 0) {
      return "Please upload documents for the selected document types";
    }

    for (let i = 0; i < docEntries.length; i++) {
      const entry = docEntries[i];
      const count = Number(numDocs[i] ?? "1");

      for (let docIndex = 0; docIndex < count; docIndex++) {
        const uploadData = entry.uploadData?.[docIndex];

        if (!uploadData?.nestedSelection) {
          return `Please select a document upload option for ${entry.type} (Document ${docIndex + 1})`;
        }

        if (
          uploadData.nestedSelection === "proceedWithAttached" &&
          (!uploadData.uploadedFiles || uploadData.uploadedFiles.length === 0)
        ) {
          return `Please upload at least one file for ${entry.type} (Document ${docIndex + 1})`;
        }
      }
    }

    return "";
  };

  const handleDialogSave = () => {
    const error = validateUploadEntries();
    if (error) {
      setFieldErrors((prev) => ({ ...prev, uploadEntries: error }));
      showSnackbar(error, "error");
      return;
    }
    clearFieldErrors("uploadEntries");
    setDialogOpen(false);
  };

  const uploadEntryFiles = async (entry: DocumentEntry) => {
    if (!entry.uploadData || entry.uploadData.length === 0) return [];

    const uploadedResults: any[] = [];

    for (const uploadData of entry.uploadData) {
      if (!uploadData.uploadedFiles || uploadData.uploadedFiles.length === 0) {
        uploadedResults.push(null); // preserve slot alignment
        continue;
      }
      const formData = new FormData();
      uploadData.uploadedFiles.forEach((file, idx) => {
        formData.append(`file_${idx}`, file);
      });
      const data = await uploadFile(formData);
      uploadedResults.push(data);
    }

    return uploadedResults;
  };

  const init = async () => {
    try {
      setLoader(true);
      setLoaderMessage("Checking for an existing order");
      const basePayload = CART_SERVICE_MAP["bulk-ordering"];
      if (!basePayload) return;
      const payload = { userId, ...basePayload };
      const orderId = await getOrderIdOfCart(payload);
      if (orderId) {
        setExistingOrderId(orderId);
        setShowCartConflict(true);
      }
    } catch {
      showSnackbar("Failed to load existing order", "error");
    } finally {
      setLoader(false);
      setLoaderMessage("");
    }
  };

  useEffect(() => {
    const auth = getAuth();

    if (auth) {
      setUserId(auth.userId);
      setCustomerId(auth.customerId);
    }
  }, []);

  const fetchStates = async () => {
    try {
      const response = await getStates();
      setStates(response);
    } catch (e) {
      console.log("Failed to fetch states.", e);
    }
  };

  useEffect(() => {
    fetchStates();
    if (customerId) init();
  }, [customerId]);

  const submitOrder = async (): Promise<boolean> => {
    const errors: Record<string, string> = {};

    const { isValid, fieldErrors: validationFieldErrors } = validateUSApostilleForm({
      country,
      additionalQuestions: shouldRenderGeneralAdditionalQuestions
        ? generalAdditionalQuestions
        : undefined,
    });

    if (!country) errors.country = "Country is required";
    if (documents.length === 0) errors.documents = "Please select at least one document";
    if (!isValid) Object.assign(errors, validationFieldErrors);

    const uploadError = validateUploadEntries();
    if (uploadError) errors.uploadEntries = uploadError;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showSnackbar(Object.values(errors)[0], "error");
      return false;
    }

    setFieldErrors({});
    try {
      setLoader(true);
      setLoaderMessage("Processing checkout...");

      const entriesWithUploads = await Promise.all(
        docEntries.map(async (entry) => ({
          ...entry,
          uploadedAttachments: await uploadEntryFiles(entry),
        })),
      );

      entriesWithUploads.forEach((entry: any, ei: number) => {
        console.log(`[Entry ${ei}] type=${entry.type}`);
        (entry.uploadedAttachments ?? []).forEach((slotResult: any, si: number) => {
          console.log(`  slot[${si}] raw result:`, JSON.stringify(slotResult));
        });
      });

      const payload = buildBulkMultiDocSingleCountryPayload({
        country,
        documents: entriesWithUploads,
        additionalServices,
        generalAdditionalQuestions: shouldRenderGeneralAdditionalQuestions
          ? generalAdditionalQuestions
          : [],
        additionalComments,
      });

      await createUSApostilleOrder(payload);

      showSnackbar("Bulk order created successfully", "success");
      window.location.href = "/cart?service=bulk-ordering";
      return true;
    } catch (error) {
      console.error("Bulk order submission failed", error);
      showSnackbar("Failed to submit bulk order", "error");
      return false;
    } finally {
      setLoader(false);
      setLoaderMessage("");
    }
  };

  return (
    <>
      <Dialog open={showCartConflict} disableEscapeKeyDown onClose={() => {}}>
        <DialogTitle>Order Already in Cart</DialogTitle>

        <DialogContent>
          <Typography>
            You already have an order in your cart. Please choose one of the options below to continue.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => { window.location.href = "/cart?service=bulk-ordering"; }}>
            Go to Cart
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              await deleteOrder(existingOrderId!);
              setShowCartConflict(false);
              setExistingOrderId(null);
            }}
          >
            Clear Cart
          </Button>
        </DialogActions>
      </Dialog>
      <OverlayLoader open={loader} message={loaderMessage} />
      <FormLayout
        title="Bulk Ordering - Add multiple documents for a single country."
        onProceed={submitOrder}
      >
        <Grid container spacing={2} alignItems="flex-start">
          {/* Country */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CountrySelect
              label="Select or Type Country"
              value={country}
              onChange={(value) => {
                setCountry(value);
                clearFieldErrors("country", "additionalQuestions");
              }}
              required
              error={Boolean(fieldErrors.country)}
              helperText={fieldErrors.country || ""}
            />
          </Grid>

          {/* Document Types */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Dropdown
              label="Select or Type Document"
              options={documentOptions}
              pinnedOptions={pinnedDocumentNames}
              value={documents
                .map((id) => documentTypes.find((d) => d.docTypeId === id)?.docTypeName)
                .filter(Boolean)}
              onChange={(selectedNames: string[]) => {
                const selectedIds = selectedNames
                  .map((name) => documentTypes.find((d) => d.docTypeName === name)?.docTypeId)
                  .filter((id): id is number => typeof id === "number");
                setDocuments(selectedIds);
                clearFieldErrors("documents", "uploadEntries");
              }}
              multiple
              required
              error={Boolean(fieldErrors.documents)}
              helperText={fieldErrors.documents || ""}
            />
          </Grid>

          {/* Additional Questions */}
          {shouldRenderGeneralAdditionalQuestions && (
            <Grid size={{ xs: 12, md: 12, sm: 6 }}>
              <AdditionalQuestions
                country={country}
                states={states}
                setAdditionalPreferences={(value: any[]) => {
                  setGeneralAdditionalQuestions(value);
                  clearFieldErrors("additionalQuestions");
                }}
                docCategoryId={522}
                error={Boolean(fieldErrors.additionalQuestions)}
                helperText={fieldErrors.additionalQuestions || ""}
              />
              <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
                Applies to General document types: {generalDocNames.join(", ")}
              </Typography>
            </Grid>
          )}

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
                borderColor: fieldErrors.uploadEntries ? "error.main" : undefined,
                "&.Mui-disabled": { color: "grey.500" },
              }}
            >
              Upload Selected Documents
            </Button>
            {fieldErrors.uploadEntries && (
              <Typography variant="caption" sx={{ mt: 0.75, display: "block", color: "error.main" }}>
                {fieldErrors.uploadEntries}
              </Typography>
            )}
          </Grid>

          {/* Additional Services */}
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
                  "&:hover fieldset": { borderColor: "rgba(0,0,0,0.12)" },
                  "&.Mui-focused fieldset": { borderColor: "rgba(0,0,0,0.12)" },
                },
              }}
            >
              <InputLabel shrink>Additional Services</InputLabel>
              <OutlinedInput
                notched
                label="Additional Services"
                inputComponent={() => (
                  <Box sx={{ width: "100%", display: "flex", alignItems: "center", overflowX: "auto", height: "100%", pl: "6px" }}>
                    <FormGroup
                      row
                      sx={{
                        flexWrap: { xs: "wrap", sm: "nowrap" },
                        justifyContent: "flex-start",
                        alignItems: "center",
                        "& .MuiFormControlLabel-root": {
                          flex: "0 0 auto",
                          whiteSpace: "nowrap",
                          "& .MuiTypography-root": { fontSize: "0.9rem" },
                          "& .MuiCheckbox-root": { transform: "scale(0.9)", p: "2px" },
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
                                  checked ? [...prev, service] : prev.filter((s) => s !== service),
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
                sx={{ "& .MuiOutlinedInput-input": { height: "auto", padding: 0 } }}
              />
            </FormControl>
          </Grid>
        </Grid>

        {/* Upload Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Upload Documents & Enter References</DialogTitle>
          <DialogContent>
            {docEntries.length === 0 ? (
              <Typography color="text.secondary">No documents selected.</Typography>
            ) : (
              <Grid container spacing={2}>
                {docEntries.map((entry, index) => (
                  <Grid
                    key={`${entry.docTypeId}-${index}`}
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
                    {/* Doc type title + count dropdown */}
                    <Grid
                      size={{ xs: 12 }}
                      sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}
                    >
                      <Typography variant="subtitle1" fontWeight={600} sx={{ color: "text.primary" }}>
                        {entry.type}
                      </Typography>
                      <Box sx={{width:"100px",}}>
                        <Dropdown
                        label="No. Of Docs"
                        value={numDocs[index] ?? "1"}
                        options={numberOptions}
                        onChange={(value: string) => handleNumDocsChange(index, value)}
                        style={{
                          "& .MuiOutlinedInput-root": { height: "35px" },
                          "& .MuiSelect-select": { padding: "8px" },
                        }}
                      />
                      </Box>
                    </Grid>

                    {/* One row per physical document */}
                    {Array.from({ length: Number(numDocs[index] ?? "1") }).map((_, docIndex) => (
                      <Grid size={12} container spacing={2} key={docIndex} sx={{ mt: 2 }}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <MultiDocumentUpload
                            country={country}
                            value={entry.uploadData?.[docIndex]}
                            onChange={(data) => handleUploadDataChange(index, docIndex, data)}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex", flexDirection: "column" }}>
                          <InputField
                            fullWidth
                            label="Customer Reference"
                            value={entry.reference?.[docIndex] ?? ""}
                            placeholder="Enter reference"
                            onChange={(e) => handleReferenceChange(index, docIndex, e.target.value)}
                          />
                          <InputField
                            label="Additional Comments"
                            placeholder="Enter comments..."
                            disabled={disabled}
                            multiline
                            minRows={9}
                            value={entry.instructions?.[docIndex] ?? ""}
                            onChange={(e) => handleAdditionalDataChange(index, docIndex, e.target.value)}
                            sx={{
                              height: "100%",
                              "& .MuiOutlinedInput-root": { height: "100%", alignItems: "flex-start" },
                              "& textarea": { height: "100% !important", resize: "none" },
                              mt: 2,
                            }}
                          />
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                ))}
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="secondary">Cancel</Button>
            <Button onClick={handleDialogSave} variant="contained" color="primary">Save</Button>
          </DialogActions>
        </Dialog>
      </FormLayout>
    </>
  );
}
