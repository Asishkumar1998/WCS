"use client";

import React, { useEffect, useMemo, useState } from "react";
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
}

type UploadsState = Record<CountryName, Record<DocumentTypeId, UploadEntry>>;

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

        const filteredEntries: Record<number, UploadEntry> = {};
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
      showSnackbar("Please map at least one document", "error");
      return;
    }

    setUploads((prev) => {
      const initialUploads: UploadsState = {};

      Object.entries(mapping).forEach(([country, docs]) => {
        if (!docs.length) return;

        initialUploads[country] = {};
        docs.forEach((docId) => {
          initialUploads[country][docId] = prev[country]?.[docId] ?? {
            uploadData: {
              uploadedFiles: [],
              nestedSelection: null,
              numPages: "",
              trackingNumberNested: "",
              courierNested: null,
            },
            services: [],
            reference: "",
          };
        });
      });

      return initialUploads;
    });
    setDialogOpen(true);
  };

  const handleUploadDataChange = (
    country: string,
    docId: number,
    data: any,
  ) => {
    setUploads((prev) => ({
      ...prev,
      [country]: {
        ...prev[country],
        [docId]: {
          ...prev[country]?.[docId],
          uploadData: {
            uploadedFiles: data?.uploadedFiles ?? [],
            nestedSelection: data?.nestedSelection ?? null,
            numPages: data?.numPages ?? "",
            trackingNumberNested: data?.trackingNumberNested ?? "",
            courierNested: data?.courierNested ?? null,
          },
        },
      },
    }));
  };

  const handleReferenceChange = (
    country: string,
    docId: number,
    value: string,
  ) => {
    setUploads((prev) => ({
      ...prev,
      [country]: {
        ...prev[country],
        [docId]: {
          ...prev[country]?.[docId],
          reference: value,
        },
      },
    }));
  };

  const toggleService = (country: string, docId: number, service: string) => {
    setUploads((prev) => {
      const current =
        prev[country]?.[docId] ??
        ({
          uploadData: {
            uploadedFiles: [],
            nestedSelection: null,
            numPages: "",
            trackingNumberNested: "",
            courierNested: null,
          },
          services: [],
          reference: "",
        } as UploadEntry);

      const nextServices = current.services.includes(service)
        ? current.services.filter((s) => s !== service)
        : [...current.services, service];

      return {
        ...prev,
        [country]: {
          ...prev[country],
          [docId]: {
            ...current,
            services: nextServices,
          },
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
    for (const country of countries) {
      const countryName = country?.countryShortName;
      const mappedDocs = mapping[countryName] ?? [];

      for (const docId of mappedDocs) {
        const doc = documentById.get(docId);
        const entry = uploads[countryName]?.[docId];

        if (!entry?.uploadData?.nestedSelection) {
          return `Please select a document upload option for ${doc?.docTypeName}`;
        }

        if (
          entry.uploadData.nestedSelection === "proceedWithAttached" &&
          entry.uploadData.uploadedFiles.length === 0
        ) {
          return `Please upload at least one file for ${doc?.docTypeName}`;
        }
      }
    }

    return "";
  };

  const handleDialogSave = () => {
    const uploadError = validateUploads();
    if (uploadError) {
      showSnackbar(uploadError, "error");
      return;
    }
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
    const mappingError = validateMappings();
    if (mappingError) {
      showSnackbar(mappingError, "error");
      return false;
    }

    const uploadError = validateUploads();
    if (uploadError) {
      showSnackbar(uploadError, "error");
      return false;
    }

    try {
      setLoader(true);
      setLoaderMessage("Processing checkout...");

      const uploadTasks: Array<{
        countryName: string;
        docId: number;
        entry: UploadEntry;
      }> = [];

      countries.forEach((country: any) => {
        const countryName = country.countryShortName;
        const mappedDocs = mapping[countryName] ?? [];

        mappedDocs.forEach((docId) => {
          const entry = uploads[countryName]?.[docId];
          if (entry) {
            uploadTasks.push({ countryName, docId, entry });
          }
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
          .map((docId) => {
            const doc = documentById.get(docId);
            if (!doc) return null;

            const result = uploadResults.find(
              (r) => r.countryName === countryName && r.docId === docId,
            );
            const entry = result?.entry ?? uploads[countryName]?.[docId];

            return {
              document: doc,
              additionalServices: entry?.services ?? [],
              uploadedAttachments: result?.uploadedAttachments ?? [],
              uploadData: entry?.uploadData ?? null,
              reference: entry?.reference ?? "",
            };
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
              onChange={setCountries}
              multiple
              disabledCountryIds={[
                3, 53, 82, 88, 93, 97, 130, 144, 196, 199, 205,
              ]}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Dropdown
              label="Select or Type Document"
              options={documentOptions}
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
              }}
              multiple
              required
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
            </Grid>
          )}

          <Grid size={{ xs: 12, md: 6 }}>
            <Button
              variant="outlined"
              fullWidth
              sx={{ height: 56 }}
              disabled={mappedDocsCount === 0}
              onClick={openUploadDialog}
            >
              Upload Selected Documents
            </Button>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <InputField
              label="Additional Comments"
              multiline
              minRows={6}
              placeholder="Enter comments..."
              onChange={(e) => setAdditionalComments(e.target.value)}
            />
          </Grid>
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
          <DialogContent dividers>
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
                      <Grid size={{ xs: 12 }}>
                        <Typography fontWeight={600}>
                          {doc?.docTypeName ?? docId}
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <MultiDocumentUpload
                          country={countryObj}
                          value={docData.uploadData}
                          onChange={(data) =>
                            handleUploadDataChange(country, numericDocId, data)
                          }
                        />
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
                                    {additionalServicesState.map((service) => (
                                      <FormControlLabel
                                        key={service}
                                        control={
                                          <Checkbox
                                            checked={docData.services.includes(
                                              service,
                                            )}
                                            onChange={() =>
                                              toggleService(
                                                country,
                                                numericDocId,
                                                service,
                                              )
                                            }
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

                        <Grid mt={3}>
                          <InputField
                            label="Customer Reference"
                            value={docData.reference}
                            onChange={(e) =>
                              handleReferenceChange(
                                country,
                                numericDocId,
                                e.target.value,
                              )
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                })}
              </Box>
            ))}
          </DialogContent>

          <DialogActions>
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
