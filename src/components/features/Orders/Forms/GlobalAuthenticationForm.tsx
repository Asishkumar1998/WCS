"use client";

import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import InputField from "@/components/ui/Input/Input";
import FormLayout from "@/components/ui/Forms/FormLayout";
import CountrySelect from "@/components/ui/Dropdown/CountryDropdown";
import { FileUploadBox } from "../Common/TranslationFileUpload";
import { postTranslationOrder, uploadFile } from "@/services/formsService";
import { useSnackbar } from "@/components/ui/Snakebar/SnackbarProvider";
import { getOrderIdOfCart } from "@/services/cartServices";
import { CART_SERVICE_MAP } from "@/constants/serviceMap";
import { deleteOrder } from "@/services/deleteService";
import { getAuth } from "@/app/utils/auth";
import OverlayLoader from "@/components/ui/Loader/OverlayLoader";

type DocItem = {
  customerReference: string;
  attachments: any[];
};

export default function GlobalAuthenticationForm() {
  const [origin, setOrigin] = useState<any>(null);
  const [destination, setDestination] = useState<any>(null);
  const [pagesCount, setPagesCount] = useState<string>("");
  const [expanded, setExpanded] = useState<number | false>(0);
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [additionalComments, setAdditionalComments] = useState<string>("");
  const [existingOrderId, setExistingOrderId] = useState<number | null>(null);
  const [showCartConflict, setShowCartConflict] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loader, setLoader] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState<string>("");

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
      const basePayload = CART_SERVICE_MAP["global-authentication"];
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
    if (documents.length) {
      setExpanded(documents.length - 1);
    }
  }, [documents.length]);

  /* Handle numeric input */
  const handlePagesChange = (value: string) => {
    if (value === "") {
      setPagesCount("");
      setDocuments([]);
      return;
    }

    const count = Number(value);
    if (isNaN(count) || count <= 0) return;

    setPagesCount(value);

    setDocuments((prev) => {
      const currentLength = prev.length;

      if (count > currentLength) {
        const newDocs = Array.from({ length: count - currentLength }, () => ({
          description: "",
          customerReference: "",
          attachments: [],
        }));
        return [...prev, ...newDocs];
      }

      return prev.slice(0, count);
    });
  };

  const handleDocChange = (
    index: number,
    field: keyof DocItem,
    value: string,
  ) => {
    setDocuments((prev) =>
      prev.map((doc, i) => (i === index ? { ...doc, [field]: value } : doc)),
    );
  };

  async function uploadAndStore(file: any, index: number) {
    if (!file) {
      setDocuments((prev) =>
        prev.map((doc, i) => (i === index ? { ...doc, attachments: [] } : doc)),
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file_0", file);

      const response = await uploadFile(formData);

      setDocuments((prev) =>
        prev.map((doc, i) =>
          i === index ? { ...doc, attachments: response } : doc,
        ),
      );
      showSnackbar("Document uploaded successfully", "success");
    } catch (err) {
      showSnackbar("Failed to upload file.", "error");
      console.error(err);
    }
  }

  const buildDocsPayload = () => {
    return documents.map((doc) => ({
      orderOriginId: 611,
      barcode: "",
      countryId: destination?.countryId,
      attachments: doc.attachments ?? [],
      isUSOrigin: false,
      docCategoryId: 525,
      isPostScan: true,
      originCountryId: origin?.countryId,
      internalReference: doc.customerReference,
      instructions: additionalComments,
    }));
  };

  const handleSubmit = async () => {
    const hasMissingUploads = documents.some(
      (doc) => !doc.attachments || doc.attachments.length === 0,
    );
    if (!origin) {
      showSnackbar("Origin Country required", "error");
      return;
    }
    if (!destination) {
      showSnackbar("Destination Country required", "error");
      return;
    }
    if (!pagesCount) {
      showSnackbar("Number of Documents required", "error");
      return;
    }
    if (hasMissingUploads) {
      showSnackbar("Please upload document for all document entries", "error");
      return;
    }

    setLoader(true);
    setLoaderMessage("Processing Checkout...");

    try {
      const payload = {
        customerId: customerId,
        orderOriginId: 611,
        orderType: 1101,
        initiatedBy: userId,
        isUSOrigin: false,
        dockets: [
          {
            docs: buildDocsPayload(),
          },
        ],
        __row_mode: "N",
      };
      await postTranslationOrder(payload);
      window.location.href = "/cart?service=global-authentication";
    } catch (error) {
      showSnackbar("Failed to add document to cart", "error");
      console.error(error);
    } finally {
      setLoader(false);
      setLoaderMessage("");
    }
  };

  const getDocumentStatus = (doc: DocItem) => {
    const hasUpload = doc.attachments.length > 0;

    if (!hasUpload) {
      return {
        label: "Upload Pending",
        color: "warning.main",
      };
    }

    return {
      label: "Upload Completed",
      color: "success.main",
    };
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
              window.location.href = "/cart?service=global-authentication";
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
      <FormLayout title="Global Authentication" onProceed={handleSubmit}>
        {/* Origin + Destination */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <CountrySelect
            label="Origin Country"
            required
            value={origin}
            onChange={setOrigin}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <CountrySelect
            label="Destination Country"
            required
            value={destination}
            onChange={setDestination}
          />
        </Grid>

        {/* Number of Pages (Numeric Input) */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <InputField
            label="Number of Documents"
            placeholder="Enter number of documents"
            type="number"
            value={pagesCount}
            required
            InputLabelProps={{
              sx: {
                "& .MuiFormLabel-asterisk": {
                  color: "red",
                },
              },
            }}
            onChange={(e) => handlePagesChange(e.target.value)}
            inputProps={{
              min: 1,
              step: 1,
            }}
          />
        </Grid>

        {/* Dynamic Document Sections */}
        {documents.map((doc, index) => {
          const isExpanded = expanded === index;
          const status = getDocumentStatus(doc);

          return (
            <Grid key={index} size={{ xs: 12 }}>
              <Box
                sx={{
                  border: "1px solid #E0E0E0",
                  borderRadius: 2,
                  mb: 1,
                  overflow: "hidden",
                }}
              >
                {/* Header */}
                <Box
                  onClick={() => setExpanded(isExpanded ? false : index)}
                  sx={{
                    cursor: "pointer",
                    px: 2,
                    py: 1.5,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#F5F7FA",
                  }}
                >
                  <Typography fontWeight={600}>Document {index + 1}</Typography>
                  <Typography variant="body2" color={status.color}>
                    {status.label}
                  </Typography>
                </Box>

                {/* Content */}
                {isExpanded && (
                  <Box sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 5.5 }}>
                        <Grid container spacing={2}>
                          {/* <Grid size={{ xs: 12 }}>
                            <InputField
                              label="Description"
                              value={doc.description}
                              onChange={(e) =>
                                handleDocChange(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                            />
                          </Grid> */}

                          <Grid size={{ xs: 12 }}>
                            <InputField
                              label="Customer Reference"
                              value={doc.customerReference}
                              onChange={(e) =>
                                handleDocChange(
                                  index,
                                  "customerReference",
                                  e.target.value,
                                )
                              }
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid size={{ xs: 12, md: 6.5 }}>
                        <FileUploadBox
                          label="Upload File"
                          fileName={doc.attachments?.[0]?.fileName || ""}
                          onSelectFile={(file) => uploadAndStore(file, index)}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
            </Grid>
          );
        })}

        {/* Additional Comments */}
        <Grid size={{ xs: 12 }}>
          <InputField
            label="Additional Comments"
            placeholder="Add Additional Comments"
            multiline
            rows={2}
            onChange={(e) => setAdditionalComments(e.target.value)}
          />
        </Grid>
      </FormLayout>
    </>
  );
}
