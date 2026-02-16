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

interface DocumentEntry {
  docTypeId: number;
  type: string;
  docCategoryId?: number;
  attachmentRequired: boolean;
  physicalRequired: boolean;
  uploadData: {
    uploadedFiles: File[];
    nestedSelection: "proceedWithAttached" | "originalMailedNested" | null;
    numPages: string;
    trackingNumberNested: string;
    courierNested: string | null;
  };
  reference: string;
  uploadedAttachments?: any;
}

export default function BulkOrderingFormTypeTwo() {
  const [country, setCountry] = useState<any>(null);
  const [documents, setDocuments] = useState<number[]>([]);
  const [additionalServices, setAdditionalServices] = useState<string[]>([]);
  const [generalAdditionalQuestions, setGeneralAdditionalQuestions] = useState<
    any[]
  >([]);
  const [states, setStates] = useState<any>();
  const [additionalComments, setAdditionalComments] = useState("");
  const [loader, setLoader] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState("");
  const [showCartConflict, setShowCartConflict] = useState(false);
  const [existingOrderId, setExistingOrderId] = useState<number | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [docEntries, setDocEntries] = useState<DocumentEntry[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [additionalServicesState] = useState(AdditionalServices);
  const [disabled, setDisabled] = useState(false);
  const { documentTypes } = useSelector((state: RootState) => state.formsData);
  const { showSnackbar } = useSnackbar();

  const PINNED_DOC_IDS = [35, 78];

  const documentOptions = useMemo(() => {
    const filteredDocs = documentTypes.filter((d) => d.docTypeId !== 36);

    const pinned = filteredDocs
      .filter((d) => PINNED_DOC_IDS.includes(d.docTypeId))
      .map((d) => d.docTypeName);

    const rest = filteredDocs
      .filter((d) => !PINNED_DOC_IDS.includes(d.docTypeId))
      .sort((a, b) => a.docTypeName.localeCompare(b.docTypeName))
      .map((d) => d.docTypeName);

    return [...pinned, ...rest];
  }, [documentTypes]);

  const selectedDocs = useMemo(
    () =>
      documents
        .map((id) => documentTypes.find((d) => d.docTypeId === id))
        .filter((doc): doc is DocumentType => !!doc),
    [documents, documentTypes],
  );

  const generalDocs = useMemo(
    () => selectedDocs.filter((doc) => doc.docCategoryId === 522),
    [selectedDocs],
  );

  const generalDocNames = useMemo(
    () => generalDocs.map((doc) => doc.docTypeName),
    [generalDocs],
  );

  const shouldRenderGeneralAdditionalQuestions = useMemo(() => {
    if (!country?.countryId) return false;
    const mappedQuestions = ADDITIONAL_QUESTION_COUNTRY_MAP[country.countryId];
    return generalDocs.length > 0 && Array.isArray(mappedQuestions) && mappedQuestions.length > 0;
  }, [country?.countryId, generalDocs.length]);

  // When docs are chosen in dropdown and user clicks upload
  const openDialogForDocs = () => {
    setDocEntries((prev) => {
      const previousById = new Map(prev.map((entry) => [entry.docTypeId, entry]));

      return selectedDocs.map((doc) => {
        const existing = previousById.get(doc.docTypeId);
        return (
          existing ?? {
            docTypeId: doc.docTypeId,
            type: doc.docTypeName,
            docCategoryId: doc.docCategoryId,
            attachmentRequired: doc.attachmentRequired,
            physicalRequired: doc.physicalRequired,
            uploadData: {
              uploadedFiles: [],
              nestedSelection: null,
              numPages: "",
              trackingNumberNested: "",
              courierNested: null,
            },
            reference: "",
          }
        );
      });
    });

    setDialogOpen(true);
  };

  const handleReferenceChange = (index: number, value: string) => {
    const updated = [...docEntries];
    updated[index].reference = value;
    setDocEntries(updated);
  };

  const handleUploadDataChange = (index: number, data: any) => {
    setDocEntries((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        uploadData: {
          uploadedFiles: data?.uploadedFiles ?? [],
          nestedSelection: data?.nestedSelection ?? null,
          numPages: data?.numPages ?? "",
          trackingNumberNested: data?.trackingNumberNested ?? "",
          courierNested: data?.courierNested ?? null,
        },
      };
      return updated;
    });
  };

  const init = async () => {
    try {
      setLoader(true);
      setLoaderMessage("Checking for an existing order");
      const basePayload = CART_SERVICE_MAP["bulk-ordering"];
      if (!basePayload) {
        return <div>Invalid service selected.</div>;
      }
      const payload = {
        userId: userId,
        ...basePayload,
      };
      const orderId = await getOrderIdOfCart(payload);
      if (orderId) {
        setExistingOrderId(orderId);
        setShowCartConflict(true);
      }
    } catch (error) {
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
    if (customerId) {
      init();
    }
  }, [customerId]);

  useEffect(() => {
    setDocEntries((prev) =>
      prev.filter((entry) => documents.includes(entry.docTypeId)),
    );
  }, [documents]);

  const validateUploadEntries = () => {
    if (docEntries.length === 0) {
      return "Please upload documents for the selected document types";
    }

    for (const entry of docEntries) {
      if (!entry.uploadData?.nestedSelection) {
        return `Please select a document upload option for ${entry.type}`;
      }
      if (
        entry.uploadData.nestedSelection === "proceedWithAttached" &&
        entry.uploadData.uploadedFiles.length === 0
      ) {
        return `Please upload at least one file for ${entry.type}`;
      }
    }

    return "";
  };

  const uploadEntryFiles = async (entry: DocumentEntry) => {
    if (!entry.uploadData?.uploadedFiles?.length) return [];

    const formData = new FormData();
    entry.uploadData.uploadedFiles.forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });

    const data = await uploadFile(formData);
    return data ?? [];
  };

  const submitOrder = async (): Promise<boolean> => {
    const { isValid, error } = validateUSApostilleForm({
      country,
      additionalQuestions: shouldRenderGeneralAdditionalQuestions
        ? generalAdditionalQuestions
        : undefined,
    });

    if (!country) {
      showSnackbar("Country is required", "error");
      return false;
    }

    if (documents.length === 0) {
      showSnackbar("Please select at least one document", "error");
      return false;
    }

    if (!isValid) {
      showSnackbar(error, "error");
      return false;
    }

    const uploadError = validateUploadEntries();
    if (uploadError) {
      showSnackbar(uploadError, "error");
      return false;
    }

    try {
      setLoader(true);
      setLoaderMessage("Processing checkout...");

      const entriesWithUploads = await Promise.all(
        docEntries.map(async (entry) => ({
          ...entry,
          uploadedAttachments: await uploadEntryFiles(entry),
        })),
      );

      const payload = buildBulkMultiDocSingleCountryPayload({
        country,
        documents: entriesWithUploads,
        additionalServices,
        generalAdditionalQuestions:
          shouldRenderGeneralAdditionalQuestions
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
            You already have an order in your cart. Please choose one of the
            options below to continue.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              window.location.href = "/cart?service=bulk-ordering";
            }}
          >
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
        <Grid container spacing={2}>
          {/* Country */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CountrySelect
              label="Select or Type Country"
              value={country}
              onChange={setCountry}
              required
            />
          </Grid>

          {/* Document Types */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Dropdown
              label="Select or Type Document"
              options={documentOptions}
              value={documents
                .map(
                  (id) =>
                    documentTypes.find((d) => d.docTypeId === id)?.docTypeName,
                )
                .filter(Boolean)}
              onChange={(selectedNames: string[]) => {
                const selectedIds = selectedNames
                  .map(
                    (name) =>
                      documentTypes.find((d) => d.docTypeName === name)
                        ?.docTypeId,
                  )
                  .filter((id): id is number => typeof id === "number");

                setDocuments(selectedIds);
              }}
              multiple
              required
            />
          </Grid>

          {/* Additional Details (with floating label) */}
          {shouldRenderGeneralAdditionalQuestions && (
            <Grid size={{ xs: 12, md: 12, sm: 6 }}>
              <AdditionalQuestions
                country={country}
                states={states}
                setAdditionalPreferences={setGeneralAdditionalQuestions}
                docCategoryId={522}
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
                "&.Mui-disabled": {
                  color: "grey.500",
                },
              }}
            >
              Upload Selected Documents
            </Button>
          </Grid>

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
                                    : prev.filter((s) => s !== service),
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
              onChange={(e) => setAdditionalComments(e.target.value)}
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
                    key={entry.docTypeId}
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
                      <MultiDocumentUpload
                        country={country}
                        value={entry.uploadData}
                        onChange={(data) => handleUploadDataChange(index, data)}
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
    </>
  );
}
