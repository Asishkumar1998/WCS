"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Grid,
  Checkbox,
  Button,
  FormGroup,
  FormControlLabel,
  FormControl,
  InputLabel,
  OutlinedInput,
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
  Link,
  Box,
} from "@mui/material";

import FormLayout from "@/components/ui/Forms/FormLayout";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import CountrySelect from "@/components/ui/Dropdown/CountryDropdown";
import InputField from "@/components/ui/Input/Input";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import MultiDocumentUpload from "../Common/MultiDocumentUpload";
import { AdditionalServices } from "@/dataset/constants/constants";
import { useSnackbar } from "@/components/ui/Snakebar/SnackbarProvider";
import OverlayLoader from "@/components/ui/Loader/OverlayLoader";
import { createUSApostilleOrder, uploadFile } from "@/services/formsService";
import buildBulkMultiDocMultiCountryPayload from "../Common/BulkOrderType3Payload";
import { CART_SERVICE_MAP } from "@/constants/serviceMap";
import { getOrderIdOfCart } from "@/services/cartServices";
import { deleteOrder } from "@/services/deleteService";
import { getAuth } from "@/app/utils/auth";
import DocumentUpload from "../Common/DocumentUpload";

type CountryName = string;
type DocumentTypeId = number;

interface UploadEntry {
  uploadData: {
    uploadedFiles: File[];
    nestedSelection: "proceedWithAttached" | "originalMailedNested" | null;
    numPages: string;
    trackingNumberNested: string;
    courierNested: string | null;
  };
  services: string[];
  reference: string;
  uploadedAttachments?: any;
  comments?: string;
}

// type UploadsState = Record<CountryName, Record<DocumentTypeId, UploadEntry>>;
type UploadsState = Record<string, Record<number, UploadEntry[]>>;

export default function BulkOrderingFormTypeThree() {
  const [countries, setCountries] = useState<any>([]);
  const [documents, setDocuments] = useState<number[]>([]);
  const [mapping, setMapping] = useState<Record<string, number[]>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploads, setUploads] = useState<UploadsState>({});
  const { documentTypes } = useSelector((state: RootState) => state.formsData);
  const [additionalComments, setAdditionalComments] = useState("");
  const [loader, setLoader] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState("");
  const [showCartConflict, setShowCartConflict] = useState(false);
  const [existingOrderId, setExistingOrderId] = useState<number | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [numDocs, setNumDocs] = useState<
    Record<string, Record<number, string>>
  >({});
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { showSnackbar } = useSnackbar();
  const [additionalServicesState] = useState(AdditionalServices);

  const PINNED_DOC_IDS = [78, 35, 36];

  const documentOptions = useMemo(() => {
    const pinned = PINNED_DOC_IDS.map((id) =>
      documentTypes.find((d) => d.docTypeId === id),
    )
      .filter((d): d is (typeof documentTypes)[number] => Boolean(d))
      .map((d) => d.docTypeName);

    const rest = documentTypes
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

  const documentById = useMemo(
    () => new Map(documentTypes.map((d) => [d.docTypeId, d])),
    [documentTypes],
  );

  const mappedDocsCount = useMemo(
    () => Object.values(mapping).reduce((acc, docs) => acc + docs.length, 0),
    [mapping],
  );
  const mappingTableMinWidth = useMemo(
    () => 220 + documents.length * 170,
    [documents.length],
  );

  useEffect(() => {
    const auth = getAuth();

    if (auth) {
      setUserId(auth.userId);
      setCustomerId(auth.customerId);
    }
  }, []);

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
        customerId: customerId,
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
    if (customerId) {
      init();
    }
  }, [customerId]);

  const clearFieldErrors = (...keys: string[]) => {
    setFieldErrors((prev) => {
      if (keys.length === 0) return {};
      const next = { ...prev };
      keys.forEach((key) => delete next[key]);
      return next;
    });
  };

  useEffect(() => {
    setMapping((prev) => {
      const validCountries = new Set(
        countries.map((c: any) => c.countryShortName),
      );
      const validDocIds = new Set(documents);

      const next: Record<string, number[]> = {};
      Object.entries(prev).forEach(([countryName, docIds]) => {
        if (!validCountries.has(countryName)) return;

        const filtered = docIds.filter((id) => validDocIds.has(id));
        if (filtered.length > 0) {
          next[countryName] = filtered;
        }
      });

      return next;
    });

    setUploads((prev) => {
      const validCountries = new Set(
        countries.map((c: any) => c.countryShortName),
      );
      const validDocIds = new Set(documents);

      const next: UploadsState = {};
      Object.entries(prev).forEach(([countryName, docEntries]) => {
        if (!validCountries.has(countryName)) return;

        const filteredEntries: Record<number, UploadEntry[]> = {};
        Object.entries(docEntries).forEach(([docId, entry]) => {
          const numericId = Number(docId);
          if (!validDocIds.has(numericId)) return;
          filteredEntries[numericId] = entry;
        });

        if (Object.keys(filteredEntries).length > 0) {
          next[countryName] = filteredEntries;
        }
      });

      return next;
    });
  }, [countries, documents]);

  const toggleMapping = (country: string, docId: number) => {
    clearFieldErrors("mapping");
    setMapping((prev) => {
      const existing = prev[country] || [];
      return {
        ...prev,
        [country]: existing.includes(docId)
          ? existing.filter((d) => d !== docId)
          : [...existing, docId],
      };
    });
  };

  const openUploadDialog = () => {
    if (mappedDocsCount === 0) {
      setFieldErrors((prev) => ({
        ...prev,
        mapping: "Please map at least one document",
      }));
      showSnackbar("Please map at least one document", "error");
      return;
    }

    clearFieldErrors("mapping");
    setFieldErrors((prev) => {
      const updated = { ...prev };

      Object.keys(updated).forEach((key) => {
        if (key.startsWith("upload_")) {
          delete updated[key];
        }
      });

      return updated;
    });
    setUploads((prev) => {
      const initialUploads: UploadsState = {};

      Object.entries(mapping).forEach(([country, docs]) => {
        if (!docs.length) return;

        initialUploads[country] = {};
        docs.forEach((docId) => {
          const count = Number(numDocs[country]?.[docId] ?? "1");
          // initialUploads[country][docId] = prev[country]?.[docId] ?? {
          //   uploadData: {
          //     uploadedFiles: [],
          //     nestedSelection: null,
          //     numPages: "",
          //     trackingNumberNested: "",
          //     courierNested: null,
          //   },
          //   services: [],
          //   reference: "",
          //   comments: "",
          // };
          initialUploads[country][docId] =
            prev[country]?.[docId] ??
            Array.from({ length: count }, () => ({
              uploadData: {
                uploadedFiles: [],
                nestedSelection: null,
                numPages: "",
                trackingNumberNested: "",
                courierNested: null,
              },
              services: [],
              reference: "",
              comments: "",
            }));
        });
      });

      return initialUploads;
    });
    setDialogOpen(true);
  };

  const handleUploadDataChange = (
    country: string,
    docId: number,
    docIndex: number,
    data: any,
  ) => {
    setUploads((prev) => {
      const existing = prev[country]?.[docId] || [];
      // const updated = [...(prev[country]?.[docId] || [])];
      const updated = [...existing];

      // updated[docIndex] = {
      //   ...updated[docIndex],
      //   uploadData: {
      //     uploadedFiles: data?.uploadedFiles ?? [],
      //     nestedSelection: data?.nestedSelection ?? null,
      //     numPages: data?.numPages ?? "",
      //     trackingNumberNested: data?.trackingNumberNested ?? "",
      //     courierNested: data?.courierNested ?? null,
      //   },
      // };
      const current = updated[docIndex] || {
        uploadData: {
          uploadedFiles: [],
          nestedSelection: null,
          numPages: "",
          trackingNumberNested: "",
          courierNested: null,
        },
        services: [],
        reference: "",
        comments: "",
      };

      updated[docIndex] = {
        ...current,
        uploadData: {
          uploadedFiles: data?.uploadedFiles ?? [],
          nestedSelection: data?.nestedSelection ?? null,
          numPages: data?.numPages ?? "",
          trackingNumberNested: data?.trackingNumberNested ?? "",
          courierNested: data?.courierNested ?? null,
        },
      };
      return {
        ...prev,
        [country]: {
          ...prev[country],
          [docId]: updated,
        },
      };
    });
  };

  const handleNumDocsChange = (
    country: string,
    numericDocId: number,
    value: string,
  ) => {
    const newCount = Number(value);

    setNumDocs((prev) => ({
      ...prev,
      [country]: {
        ...prev[country],
        [numericDocId]: value,
      },
    }));

    setUploads((prev) => {
      const existing = prev[country]?.[numericDocId] ?? [];
      // const newCount = Number(value);

      const updated = [...existing];

      while (updated.length < newCount) {
        updated.push({
          uploadData: {
            uploadedFiles: [],
            nestedSelection: null,
            numPages: "",
            trackingNumberNested: "",
            courierNested: null,
          },
          services: [],
          reference: "",
          comments: "",
        });
      }

      updated.length = newCount;

      return {
        ...prev,
        [country]: {
          ...prev[country],
          [numericDocId]: updated,
        },
      };
    });

    setFieldErrors((prev) => {
      const updatedErrors = { ...prev };

      Object.keys(updatedErrors).forEach((key) => {
        const prefix = `upload_${country}_${numericDocId}_`;

        if (key.startsWith(prefix)) {
          const index = Number(key.replace(prefix, ""));

          if (index >= newCount) {
            delete updatedErrors[key];
          }
        }
      });

      return updatedErrors;
    });
  };
  const handleCommentsChange = (
    country: string,
    docId: number,
    docIndex: number,
    value: string,
  ) => {
    setUploads((prev) => {
      const updated = [...(prev[country]?.[docId] || [])];
      updated[docIndex].comments = value;

      return {
        ...prev,
        [country]: {
          ...prev[country],
          [docId]: updated,
        },
      };
    });
  };

  const handleReferenceChange = (
    country: string,
    docId: number,
    docIndex: number,
    value: string,
  ) => {
    setUploads((prev) => {
      const updated = [...(prev[country]?.[docId] || [])];
      updated[docIndex].reference = value;

      return {
        ...prev,
        [country]: {
          ...prev[country],
          [docId]: updated,
        },
      };
    });
  };
  
  const toggleService = (
    country: string,
    docId: number,
    docIndex: number,
    service: string,
  ) => {
    setUploads((prev) => {
      const updated = [...(prev[country]?.[docId] || [])];

      const current = updated[docIndex];

      const nextServices = current.services.includes(service)
        ? current.services.filter((s) => s !== service)
        : [...current.services, service];

      updated[docIndex] = {
        ...current,
        services: nextServices,
      };

      return {
        ...prev,
        [country]: {
          ...prev[country],
          [docId]: updated,
        },
      };
    });
  };
  const validateMappings = () => {
    if (countries.length === 0) {
      return "Please select at least one country";
    }
    if (documents.length === 0) {
      return "Please select at least one document";
    }

    for (const country of countries) {
      const countryName = country?.countryShortName;
      const mappedDocs = mapping[countryName] ?? [];
      if (mappedDocs.length === 0) {
        return `Please map at least one document for ${countryName}`;
      }
    }

    return "";
  };

  const validateUploads = () => {
    const errors: Record<string, string> = {};

    countries.forEach((country: any) => {
      const countryName = country.countryShortName;
      const mappedDocs = mapping[countryName] ?? [];

      mappedDocs.forEach((docId) => {
        const count = Number(numDocs[countryName]?.[docId] ?? "1");

        for (let index = 0; index < count; index++) {
          const entry = uploads[countryName]?.[docId]?.[index];

          const key = `upload_${countryName}_${docId}_${index}`;

          // If dialog never opened → entry undefined
          if (!entry || !entry.uploadData?.nestedSelection) {
            errors[key] = "Please select upload option";
            continue;
          }

          if (
            entry.uploadData.nestedSelection === "proceedWithAttached" &&
            entry.uploadData.uploadedFiles.length === 0
          ) {
            errors[key] = "Please upload required file";
          }
        }
      });
    });

    return errors;
  };

  const handleDialogSave = () => {
    const errors = validateUploads();

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      //scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      const element = rowRefs.current[firstErrorKey];

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

      return;
    }
    setFieldErrors({});
    setDialogOpen(false);
  };

  const uploadEntryFiles = async (entry: UploadEntry) => {
    if (!entry.uploadData?.uploadedFiles?.length) return [];

    const formData = new FormData();
    entry.uploadData.uploadedFiles.forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });

    const data = await uploadFile(formData);
    return data ?? [];
  };

  const submitOrder = async (): Promise<boolean> => {
    const errors: Record<string, string> = {};
    const mappingError = validateMappings();
    if (mappingError) {
      if (countries.length === 0) {
        errors.countries = "Please select at least one country";
      }
      if (documents.length === 0) {
        errors.documents = "Please select at least one document";
      }
      if (!errors.countries && !errors.documents) {
        errors.mapping = mappingError;
      }
    }

    const uploadErrors = validateUploads();
    // if (uploadError) {
    //   errors.uploadEntries = uploadError;
    // }
    if (Object.keys(uploadErrors).length > 0) {
      Object.assign(errors, uploadErrors);
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showSnackbar(Object.values(errors)[0], "error");
      return false;
    }

    setFieldErrors({});
    try {
      setLoader(true);
      setLoaderMessage("Uploading documents...")

      const uploadTasks: Array<{
        countryName: string;
        docId: number;
        entry: UploadEntry;
      }> = [];

      countries.forEach((country: any) => {
        const countryName = country.countryShortName;
        const mappedDocs = mapping[countryName] ?? [];

        // mappedDocs.forEach((docId) => {
        //   const entry = uploads[countryName]?.[docId];
        //   if (entry) {
        //     uploadTasks.push({ countryName, docId, entry });
        //   }
        // });
        mappedDocs.forEach((docId) => {
          const entries = uploads[countryName]?.[docId] ?? [];

          entries.forEach((entry) => {
            uploadTasks.push({ countryName, docId, entry });
          });
        });
      });

      const uploadResults = await Promise.all(
        uploadTasks.map(async ({ countryName, docId, entry }) => ({
          countryName,
          docId,
          entry,
          uploadedAttachments: await uploadEntryFiles(entry),
        })),
      );
      setLoaderMessage("Processing checkout...");

      const countryDocuments: Record<
        string,
        {
          document: any;
          additionalServices: string[];
          uploadedAttachments: any[];
          uploadData: any;
          reference?: string;
        }[]
      > = {};

      countries.forEach((country: any) => {
        const countryName = country.countryShortName;
        const mappedDocs = mapping[countryName] ?? [];
        if (mappedDocs.length === 0) return;

        const docsForCountry = mappedDocs
          .flatMap((docId) => {
            const doc = documentById.get(docId);
            if (!doc) return [];

            // const result = uploadResults.find(
            //   (r) => r.countryName === countryName && r.docId === docId,
            // );
            // const entry = result?.entry ?? uploads[countryName]?.[docId];
            const entries = uploads[countryName]?.[docId] ?? [];

            return entries.map((entry) => {
              const result = uploadResults.find(
                (r) =>
                  r.countryName === countryName &&
                  r.docId === docId &&
                  r.entry === entry,
              );

              return {
                document: doc,
                additionalServices: entry?.services ?? [],
                uploadedAttachments: result?.uploadedAttachments ?? [],
                uploadData: entry?.uploadData ?? null,
                reference: entry?.reference ?? "",
                comments: entry?.comments ?? "",
              };
            });
          })
          .filter(Boolean);

        if (docsForCountry.length > 0) {
          countryDocuments[countryName] = docsForCountry as any;
        }
      });

      const payload = buildBulkMultiDocMultiCountryPayload({
        countries,
        countryDocuments,
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
        title="Bulk Ordering - Add multiple documents for multiple countries."
        onProceed={submitOrder}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CountrySelect
              label="Select Countries"
              value={countries}
              onChange={(value) => {
                setCountries(value);
                clearFieldErrors("countries", "mapping");
              }}
              multiple
              disabledCountryIds={[
                3, 53, 82, 88, 93, 97, 130, 144, 196, 199, 205,
              ]}
              required
              error={Boolean(fieldErrors.countries)}
              helperText={fieldErrors.countries || ""}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Dropdown
              label="Select or Type Document"
              options={documentOptions}
              pinnedOptions={pinnedDocumentNames}
              value={documents
                .map((id) => documentById.get(id)?.docTypeName)
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
                clearFieldErrors("documents", "mapping", "uploadEntries");
              }}
              multiple
              required
              error={Boolean(fieldErrors.documents)}
              helperText={fieldErrors.documents || ""}
            />
          </Grid>

          {countries.length > 0 && documents.length > 0 && (
            <Grid size={{ xs: 12 }} sx={{ minWidth: 0, overflow: "hidden" }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                Map Documents to Countries
              </Typography>

              <Box
                sx={{
                  width: "100%",
                  maxWidth: "100%",
                  overflowX: "scroll",
                  overflowY: "hidden",
                  scrollbarGutter: "stable",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#9aa0a6 #e5e7eb",
                  pb: 0.5,
                  "&::-webkit-scrollbar": {
                    height: 12,
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#e5e7eb",
                    borderRadius: 8,
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#9aa0a6",
                    borderRadius: 8,
                  },
                }}
              >
                <Table
                  size="small"
                  sx={{
                    width: `max(100%, ${mappingTableMinWidth}px)`,
                    tableLayout: "auto",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          minWidth: 180,
                          position: "sticky",
                          left: 0,
                          zIndex: 3,
                          backgroundColor: "background.paper",
                        }}
                      >
                        Country
                      </TableCell>
                      {documents.map((docId) => (
                        <TableCell
                          key={docId}
                          align="center"
                          // sx={{ minWidth: 170, whiteSpace: "nowrap" }}
                          sx={{
                            minWidth: 170,
                            maxWidth: 220,
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            lineHeight: 1.2,
                            textAlign: "center",
                          }}
                        >
                          {documentById.get(docId)?.docTypeName ?? docId}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {countries.map((country: any) => {
                      const countryName = country?.countryShortName;

                      return (
                        <TableRow key={countryName}>
                          <TableCell
                            sx={{
                              minWidth: 180,
                              position: "sticky",
                              left: 0,
                              zIndex: 2,
                              backgroundColor: "background.paper",
                            }}
                          >
                            {countryName}
                          </TableCell>
                          {documents.map((docId) => (
                            <TableCell key={docId} align="center">
                              <Checkbox
                                checked={
                                  mapping[countryName]?.includes(docId) || false
                                }
                                onChange={() =>
                                  toggleMapping(countryName, docId)
                                }
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
              {fieldErrors.mapping && (
                <Typography
                  variant="caption"
                  sx={{ mt: 0.75, display: "block", color: "error.main" }}
                >
                  {fieldErrors.mapping}
                </Typography>
              )}
            </Grid>
          )}

          <Grid size={{ xs: 12, md: 6 }}>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                height: 56,
                borderColor: Object.keys(fieldErrors).some((key) =>
                  key.startsWith("upload_"),
                )
                  ? "error.main"
                  : undefined,
              }}
              disabled={mappedDocsCount === 0}
              onClick={openUploadDialog}
            >
              Upload Selected Documents
            </Button>
            {Object.keys(fieldErrors).some((key) =>
              key.startsWith("upload_"),
            ) && (
              <Typography
                variant="caption"
                sx={{ mt: 0.75, display: "block", color: "error.main" }}
              >
                {fieldErrors.uploadEntries}
              </Typography>
            )}
          </Grid>

          {/* <Grid size={{ xs: 12 }}>
            <InputField
              label="Additional Comms"
              multiline
              minRows={6}
              placeholder="Enter comments..."
              onChange={(e) => setAdditionalComments(e.target.value)}
            />
          </Grid> */}
          <Grid size={{ xs: 12 }}>
            <Alert severity="warning" sx={{ alignItems: "flex-start" }}>
              <Typography variant="body2">
                Bulk ordering is not supported for{" "}
                <Box component="span" sx={{ fontWeight: 600 }}>
                  Algeria, Egypt, Iraq, Jordan, Kuwait, Lebanon, Nigeria, Qatar,
                  Yemen, Taiwan, and Kurdistan
                </Box>
                .
              </Typography>

              <Typography variant="body2" sx={{ mt: 1 }}>
                Please submit requests via the{" "}
                <Link
                  href="/orders/new/us-authentication"
                  sx={{
                    fontWeight: 600,
                    textDecoration: "underline",
                    color: "primary.main",
                  }}
                >
                  New order
                </Link>{" "}
                tab.
              </Typography>
            </Alert>
          </Grid>
        </Grid>

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Upload Documents</DialogTitle>
          <DialogContent
            dividers
            sx={{
              maxHeight: "80vh",
              overflowY: "auto",

              /* Scrollbar styles */
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "primary.main",
              },
            }}
          >
            {Object.entries(uploads).map(([country, docs]) => (
              <Box key={country} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                  {country}
                </Typography>

                {Object.entries(docs).map(([docId, docData]) => {
                  const numericDocId = Number(docId);
                  const doc = documentById.get(numericDocId);
                  const countryObj = countries.find(
                    (c: any) => c.countryShortName === country,
                  );

                  return (
                    <Grid
                      key={docId}
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
                      <Grid
                        size={{ xs: 12 }}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Typography fontWeight={600}>
                          {doc?.docTypeName ?? docId}
                        </Typography>
                        <Box sx={{ width: "100px" }}>
                          <Dropdown
                            label="No. Of Docs"
                            value={numDocs[country]?.[numericDocId] ?? "1"}
                            options={["1", "2", "3", "4", "5"]}
                            onChange={(value: string) =>
                              handleNumDocsChange(country, numericDocId, value)
                            }
                            style={{
                              "& .MuiOutlinedInput-root": { height: "35px" },
                              "& .MuiSelect-select": { padding: "8px" },
                            }}
                          />
                        </Box>
                      </Grid>

                      {docData.map((entry, docIndex) => {
                        const errorKey = `upload_${country}_${numericDocId}_${docIndex}`;
                        const docError = fieldErrors[errorKey];
                        return (
                          <Grid
                            size={12}
                            container
                            spacing={2}
                            key={`${country}_${numericDocId}_${docIndex}`}
                            sx={{ mt: 2 }}
                          >
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <div
                                ref={(el) => {
                                  rowRefs.current[errorKey] = el;
                                }}
                              >
                                <DocumentUpload
                                  country={countryObj}
                                  // value={entry.uploadData}
                                  onChange={(data) =>
                                    handleUploadDataChange(
                                      country,
                                      numericDocId,
                                      docIndex,
                                      {
                                        uploadedFiles: data?.uploadedFile
                                          ? [data.uploadedFile]
                                          : [],
                                        nestedSelection:
                                          data?.nestedSelection ?? null,
                                        numPages: data?.numPages ?? "",
                                        trackingNumberNested:
                                          data?.trackingNumberNested ?? "",
                                        courierNested:
                                          data?.courierNested ?? null,
                                      },
                                    )
                                  }
                                  error={Boolean(docError)}
                                  errorText={docError || ""}
                                  onInteraction={() => {
                                    setFieldErrors((prev) => {
                                      const updated = { ...prev };
                                      delete updated[errorKey];
                                      return updated;
                                    });
                                  }}
                                  hideBulkOrderingHint={true}
                                />
                              </div>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Grid>
                                <FormControl
                                  fullWidth
                                  variant="outlined"
                                  sx={{
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: 1,
                                      minHeight: 56,
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
                                  <InputLabel shrink>
                                    Additional Services
                                  </InputLabel>

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
                                          minHeight: 48,
                                          pl: "6px",
                                        }}
                                      >
                                        <FormGroup
                                          row
                                          sx={{
                                            flexWrap: "nowrap",
                                            justifyContent: "flex-start",
                                            alignItems: "center",
                                            "& .MuiFormControlLabel-root": {
                                              flex: "0 0 auto",
                                              whiteSpace: "nowrap",
                                              mr: 1.5,
                                              ml: 0,
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
                                          {additionalServicesState.map(
                                            (service) => (
                                              <FormControlLabel
                                                key={service}
                                                control={
                                                  <Checkbox
                                                    checked={entry.services.includes(
                                                      service,
                                                    )}
                                                    onChange={() =>
                                                      toggleService(
                                                        country,
                                                        numericDocId,
                                                        docIndex,
                                                        service,
                                                      )
                                                    }
                                                  />
                                                }
                                                label={service}
                                              />
                                            ),
                                          )}
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

                              <Grid mt={3}>
                                <InputField
                                  label="Customer Reference"
                                  value={entry.reference}
                                  onChange={(e) =>
                                    handleReferenceChange(
                                      country,
                                      numericDocId,
                                      docIndex,
                                      e.target.value,
                                    )
                                  }
                                />
                              </Grid>
                              {/* <InputField
                            label="Additional Comments"
                            placeholder="Enter comments..."
                            disabled={disabled}
                            multiline
                            minRows={9}
                            value={entry.instructions?.[docIndex] ?? ""}
                            // onChange={(e) => handleAdditionalDataChange(index, docIndex, e.target.value)}
                            setAdditionalComments
                            sx={{
                              height: "100%",
                              "& .MuiOutlinedInput-root": { height: "100%", alignItems: "flex-start" },
                              "& textarea": { height: "100% !important", resize: "none" },
                              mt: 2,
                            }}
                          /> */}
                              <Grid size={{ xs: 12 }}>
                                <InputField
                                  sx={{ mt: 3 }}
                                  label="Additional Comments"
                                  multiline
                                  minRows={6}
                                  placeholder="Enter comments..."
                                  value={entry.comments || ""}
                                  onChange={(e) =>
                                    handleCommentsChange(
                                      country,
                                      numericDocId,
                                      docIndex,
                                      e.target.value,
                                    )
                                  }
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        );
                      })}
                    </Grid>
                  );
                })}
              </Box>
            ))}
          </DialogContent>

          <DialogActions sx={{ flexShrink: 0 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleDialogSave}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </FormLayout>
    </>
  );
}
