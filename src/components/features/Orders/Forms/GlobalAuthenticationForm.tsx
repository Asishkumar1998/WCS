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

type DocItem = {
  description: string;
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
  const userId = localStorage.getItem("userId");
  const customerId = localStorage.getItem("customerId");

  const init = async () => {
    const basePayload = CART_SERVICE_MAP["global-authentication"];
    if (!basePayload) {
      return <div>Invalid service selected.</div>;
    }
    const payload = {
      customerId: customerId,
      ...basePayload,
    };
    const orderId = await getOrderIdOfCart(payload);
    if (orderId) {
      setExistingOrderId(orderId);
      setShowCartConflict(true);
    }
  };

  useEffect(() => {
    init();
  }, []);

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
    value: string
  ) => {
    setDocuments((prev) =>
      prev.map((doc, i) => (i === index ? { ...doc, [field]: value } : doc))
    );
  };

  async function uploadAndStore(file: any, index: number) {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file_0", file);

      const response = await uploadFile(formData);

      setDocuments((prev) =>
        prev.map((doc, i) =>
          i === index ? { ...doc, attachments: response } : doc
        )
      );
    } catch (err) {
      showSnackbar("Failed to upload file.", "error");
      console.error(err);
    }
  }

  const buildDocsPayload = () => {
    return documents.map((doc) => ({
      orderOriginId: 611,
      barcode: "",
      description: doc.description,
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
    }
  };

  const getDocumentStatus = (doc: DocItem) => {
    const hasDescription = doc.description.trim() !== "";
    const hasCustomerRef = doc.customerReference.trim() !== "";
    const hasUpload = doc.attachments.length > 0;

    if (!hasDescription || !hasCustomerRef) {
      return {
        label: "Pending",
        color: "text.secondary",
      };
    }

    if (!hasUpload) {
      return {
        label: "Pending Upload",
        color: "warning.main",
      };
    }

    return {
      label: "Completed",
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
      <FormLayout title="Global Authentication" onProceed={handleSubmit}>
        {/* Origin + Destination */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <CountrySelect
            label="Origin Country *"
            value={origin}
            onChange={setOrigin}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <CountrySelect
            label="Destination Country *"
            value={destination}
            onChange={setDestination}
          />
        </Grid>

        {/* Number of Pages (Numeric Input) */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <InputField
            label="Number of Pages *"
            placeholder="Enter number of pages"
            type="number"
            value={pagesCount}
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
                          <Grid size={{ xs: 12 }}>
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
                          </Grid>

                          <Grid size={{ xs: 12 }}>
                            <InputField
                              label="Customer Reference"
                              value={doc.customerReference}
                              onChange={(e) =>
                                handleDocChange(
                                  index,
                                  "customerReference",
                                  e.target.value
                                )
                              }
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid size={{ xs: 12, md: 6.5 }}>
                        <FileUploadBox
                          label="Upload File"
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
