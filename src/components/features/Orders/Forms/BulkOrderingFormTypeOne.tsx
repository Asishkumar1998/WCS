"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Grid,
  Checkbox,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Alert,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import InputField from "@/components/ui/Input/Input";
import FormLayout from "@/components/ui/Forms/FormLayout";
import CountrySelect from "@/components/ui/Dropdown/CountryDropdown";
import DocumentUpload from "../Common/DocumentUpload";
import DocumentDropdown from "@/components/ui/Dropdown/DocumentDropdown";
import { DocType } from "./NotaryServiceForm";
import { useSnackbar } from "@/components/ui/Snakebar/SnackbarProvider";
import { createUSApostilleOrder, uploadFile } from "@/services/formsService";
import buildBulkSingleDocMultiCountryPayload from "../Common/BulkOrderType1Payload";
import validateUSApostilleForm from "../Common/validateUSForm";
import OverlayLoader from "@/components/ui/Loader/OverlayLoader";
import { deleteOrder } from "@/services/deleteService";
import { CART_SERVICE_MAP } from "@/constants/serviceMap";
import { getOrderIdOfCart } from "@/services/cartServices";
import { getAuth } from "@/app/utils/auth";

type ServiceType = "preScan" | "postScan" | "rush";

const SERVICES: { key: ServiceType; label: string }[] = [
  { key: "preScan", label: "Pre-Scan" },
  { key: "postScan", label: "Post-Scan" },
  { key: "rush", label: "Rush" },
];

type ServiceMapping = Record<
  string,
  {
    preScan: boolean;
    postScan: boolean;
    rush: boolean;
  }
>;

export default function BulkOrderingFormTypeOne() {
  const [countries, setCountries] = useState<any>([]);
  const [document, setDocument] = useState<DocType | null>(null);
  const [serviceMapping, setServiceMapping] = useState<ServiceMapping>({});
  const [disabled, setDisabled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [customerReference, setCustomerReference] = useState<any>();
  const [additionalComments, setAddtionalComments] = useState<string>();
  const lastUploadedRef = useRef<string | null>(null);
  const [uploadDocValues, setUploadDocValues] = useState<any>();
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [trackingNo, setTrackingNo] = useState<any>(null);
  const [courierType, setCourierType] = useState<string | null>(null);
  const [numberOfPages, setNumberOfPages] = useState();
  const [loader, setLoader] = useState<boolean>(false);
  const [loaderMessage, setLoaderMessage] = useState<string>("");
  const [showCartConflict, setShowCartConflict] = useState(false);
  const [existingOrderId, setExistingOrderId] = useState<number | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { showSnackbar } = useSnackbar();

  const clearFieldErrors = (...keys: string[]) => {
    setFieldErrors((prev) => {
      if (keys.length === 0) return {};
      const next = { ...prev };
      keys.forEach((key) => delete next[key]);
      return next;
    });
  };

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

  // Initialize service mapping per country
  useEffect(() => {
    setServiceMapping((prev) => {
      const updated: ServiceMapping = {};

      countries.forEach((country: any) => {
        const key = country.countryShortName;

        updated[key] = prev[key] ?? {
          preScan: false,
          postScan: false,
          rush: false,
        };
      });

      return updated;
    });
  }, [countries]);

  const toggleService = (country: string, service: ServiceType) => {
    setServiceMapping((prev) => ({
      ...prev,
      [country]: {
        ...prev[country],
        [service]: !prev[country]?.[service],
      },
    }));
  };

  const handleDocumentSelect = (newValue: DocType | null) => {
    if (!newValue) return;
    setDocument(newValue);
    setDisabled(false);
    clearFieldErrors("document");
  };

  const handleDocumentUpload = async (data: any) => {
    clearFieldErrors("uploadOption", "uploadDocument");
    if (!data.uploadedFile) {
      lastUploadedRef.current = null;
      setUploadedDoc(null);
    }
    setTrackingNo(data.trackingNumberNested || null);
    setCourierType(data.courierNested || null);
    setNumberOfPages(data?.numPages);
    setUploadDocValues(data);

    const file: File | null = data?.uploadedFile;
    if (!file) return;

    const fileKey = `${file.name}-${file.size}`;

    if (lastUploadedRef.current === fileKey) {
      return;
    }

    lastUploadedRef.current = fileKey;

    if (file) {
      try {
        const formData = new FormData();
        formData.append("file_0", file);
        const data = await uploadFile(formData);
        showSnackbar("Document uploaded successfully", "success");
        setUploadedDoc(data);
      } catch (err) {
        console.log(err);
        showSnackbar("Error while uploading document.File size should be below 50MB", "error");
      }
    }
  };

  const submitOrder = async () => {
    const { isValid, error, fieldErrors: validationFieldErrors } =
      validateUSApostilleForm({
      countries,
      document,
      uploadDocValues,
      });

    if (!isValid) {
      setFieldErrors(validationFieldErrors);
      showSnackbar(error, "error");
      return false;
    }

    setFieldErrors({});
    try {
      // Ensure each country has service mapping
      for (const country of countries) {
        const key = country.countryShortName;
        if (!serviceMapping[key]) {
          showSnackbar(`Additional services missing for ${key}`, "error");
          return false;
        }
      }

      setLoader(true);
      setLoaderMessage("Processing checkout...");

      const payload = buildBulkSingleDocMultiCountryPayload({
        countries,
        document,
        serviceMapping,
        uploadedDoc,
        customerReference,
        additionalComments,
        numberOfPages,
        trackingNo,
        courierType,
        nestedSelection: uploadDocValues?.nestedSelection ?? null,
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
        title="Bulk Ordering - Add single document for multiple countries."
        onProceed={submitOrder}
      >
        <Grid container spacing={2}>
          {/* Document */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <DocumentDropdown
              label="Select or Type Document"
              value={document}
              required
              error={Boolean(fieldErrors.document)}
              helperText={fieldErrors.document || ""}
              onChange={handleDocumentSelect}
              open={dropdownOpen}
              onOpen={() => setDropdownOpen(true)}
              onClose={() => setDropdownOpen(false)}
              isBulkOrder={true}
            />
          </Grid>

          {/* Country */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CountrySelect
              label="Select Countries"
              value={countries}
              onChange={(value) => {
                setCountries(value);
                clearFieldErrors("countries");
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

          {/* Additional Services Mapping */}
          {countries.length > 0 && (
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                Map Additional Services to Countries
              </Typography>

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Country</TableCell>
                    {SERVICES.map((service) => (
                      <TableCell key={service.key} align="center">
                        {service.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {countries.map((country: any) => {
                    const countryName = country.countryShortName;

                    return (
                      <TableRow key={countryName}>
                        <TableCell>{countryName}</TableCell>

                        {SERVICES.map((service) => (
                          <TableCell key={service.key} align="center">
                            <Checkbox
                              checked={
                                serviceMapping[countryName]?.[service.key] ||
                                false
                              }
                              onChange={() =>
                                toggleService(countryName, service.key)
                              }
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

          {/* Document Upload */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", width: "100%" }}>
              <DocumentUpload
                onChange={handleDocumentUpload}
                country=""
                hideBulkOrderingHint
                error={Boolean(
                  fieldErrors.uploadOption || fieldErrors.uploadDocument,
                )}
                errorText={
                  fieldErrors.uploadOption || fieldErrors.uploadDocument || ""
                }
                onInteraction={() =>
                  clearFieldErrors("uploadOption", "uploadDocument")
                }
              />
            </Box>
          </Grid>

          {/* Customer Reference & Comments */}
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{ display: "flex", flexDirection: "column", minHeight: 0 }}
          >
            <InputField
              label="Customer Reference"
              placeholder="Enter reference number"
              onChange={(e) => setCustomerReference(e.target.value)}
            />

            <InputField
              label="Additional Comments"
              placeholder="Enter comments..."
              disabled={disabled}
              onChange={(e) => setAddtionalComments(e.target.value)}
              multiline
              sx={{
                marginTop: "15px",
                flex: 1,
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
                  }}
                >
                  New order
                </Link>{" "}
                tab.
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </FormLayout>
    </>
  );
}
