"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  OutlinedInput,
  Box,
  Tooltip,
} from "@mui/material";
import InputField from "@/components/ui/Input/Input";
import FormLayout from "@/components/ui/Forms/FormLayout";
import { AdditionalServices } from "@/dataset/constants/constants";
import CountrySelect from "@/components/ui/Dropdown/CountryDropdown";
import DocumentUpload from "../Common/DocumentUpload";
import { CART_SERVICE_MAP } from "@/constants/serviceMap";
import { getOrderDetails, getOrderIdOfCart } from "@/services/cartServices";
import {
  buildNotaryDispatchPayloadFromExistingOrder,
  buildNotaryPayload,
} from "../Common/NotaryDispatchPayload";
import { postTranslationOrder, uploadFile } from "@/services/formsService";
import { useSnackbar } from "@/components/ui/Snakebar/SnackbarProvider";
import { updateOrder } from "@/services/paymentService";
import DocumentDropdown from "@/components/ui/Dropdown/DocumentDropdown";
import { getAuth } from "@/app/utils/auth";
import OverlayLoader from "@/components/ui/Loader/OverlayLoader";

export interface DocType {
  docTypeId: number;
  docTypeName: string;
  docCategoryId: number;
  personalDoc: number;
  physicalRequired: number;
  createdBy: any;
  createdAt: number;
  modifiedBy: any;
  modifiedAt: number;
  ordSequence: any;
  attachmentRequired: any;
  isDeleted: boolean;
}

export default function DispatchServiceForm() {
  const [country, setCountry] = useState<any>(null);
  const [document, setDocument] = useState<DocType | null>(null);
  const [additionalServices, setAdditionalServices] = useState<string[]>([]);
  const [attachment, setAttachment] = useState<any>();
  const [basePayload, setBasePayload] = useState<any>(null);
  const [customerReference, setCustomerReference] = useState<any>();
  const [additionalComments, setAdditionalComments] = useState<any>();
  const [numberOfPages, setNumberOfPages] = useState();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [additionalServicesState, setAdditionalServicesState] =
    useState(AdditionalServices);
  const [disabled, setDisabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useSnackbar();
  const lastUploadedRef = useRef<string | null>(null);
  const [uploadDocValues, setUploadDocValues] = useState<any>();
  const [trackingNo, setTrackingNo] = useState<any>(null);
  const [courierType, setCourierType] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [customerId, setCustomerId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [formResetKey, setFormResetKey] = useState(0);

  const resetForm = () => {
    setCountry(null);
    setDocument(null);
    setAdditionalServices([]);
    setAdditionalServicesState([...AdditionalServices]);
    setDisabled(false);
    setDropdownOpen(false);
    setFieldErrors({});

    setFormResetKey((prev) => prev + 1);
  };

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

  const handleDocumentUpload = async (data: any) => {
    clearFieldErrors("uploadOption", "uploadDocument");
    setUploadDocValues(data);
    setNumberOfPages(data?.numPages);
    setTrackingNo(data.trackingNumberNested || null);
    setCourierType(data.courierNested || null);
    const file = data?.uploadedFile;
    if (!file) {
      lastUploadedRef.current = null;
      setAttachment(undefined);
      return;
    }

    const fileKey = `${file.name}-${file.size}`;

    if (lastUploadedRef.current === fileKey) {
      return;
    }
    lastUploadedRef.current = fileKey;

    try {
      const formData = new FormData();
      formData.append("file_0", file);
      const data = await uploadFile(formData);
      setAttachment(data);
      showSnackbar("Document uploaded successfully", "success");
    } catch (err) {
      console.log(err);
      showSnackbar("Error while uploading document.File size should be below 50MB", "error");
    }
  };

  const submitOrder = async (): Promise<boolean> => {
    const errors: Record<string, string> = {};

    if (!country) {
      errors.country = "Please Select Country";
    }
    if (!document) {
      errors.document = "Please Select Document";
    }
    if (!uploadDocValues?.nestedSelection) {
      errors.uploadOption = "Please Select Document Upload options";
    }
    if (
      uploadDocValues?.nestedSelection === "proceedWithAttached" &&
      !uploadDocValues?.uploadedFile
    ) {
      errors.uploadDocument = "Please Upload Document";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showSnackbar(Object.values(errors)[0], "error");
      return false;
    }

    setFieldErrors({});

    setIsSubmitting(true);
    let payload;
    try {
      if (basePayload == null) {
        payload = buildNotaryPayload({
          country,
          additionalComments,
          customerReference,
          additionalServices,
          attachment,
          numberOfPages,
          isNotary: false,
          trackingNo,
          courierType,
          nestedSelection: uploadDocValues?.nestedSelection ?? null,
        });
        await postTranslationOrder(payload);
      } else {
        payload = buildNotaryDispatchPayloadFromExistingOrder({
          basePayload,
          country,
          additionalServices,
          additionalComments,
          attachment,
          customerReference,
          numberOfPages,
          isNotary: false,
          trackingNo,
          courierType,
          nestedSelection: uploadDocValues?.nestedSelection ?? null,
        });
        await updateOrder(payload.orderId, payload);
      }
      return true;
    } catch (error) {
      showSnackbar("Failed to submit order", "error");
      console.error(error);
      return false;
    } finally {
      setCustomerReference("");
      setAdditionalComments(null);
      setIsSubmitting(false);
    }
  };

  const addToCart = async () => {
    const success = await submitOrder();
    if (success) {
      showSnackbar("Document added to Cart", "success");
      resetForm();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const proceedToCart = async () => {
    const success = await submitOrder();
    if (success) window.location.href = "/cart?service=dispatch-service";
  };

  // Get the previous cart order details.
  const getCartOrder = async () => {
    try {
      const basePayload = CART_SERVICE_MAP["us-authentication"];
      if (!basePayload) {
        return <div>Invalid service selected.</div>;
      }
      const payload = {
        userId: userId,
        docCategoryId: 529,
        ...basePayload,
      };
      const orderId = await getOrderIdOfCart(payload);
      if (orderId != null) {
        const response = await getOrderDetails({ orderId: orderId });
        const orderData = response[0];
        setBasePayload(orderData);
      }
    } catch (error) {
      console.error("Error in getCartOrder:", error);
    }
  };

  useEffect(() => {
    if (customerId) {
      getCartOrder();
    }
  }, [customerId, formResetKey]);

  const handleDocumentSelect = (newValue: DocType | null) => {
    if (!newValue) return;
    setDocument(newValue);
    setDisabled(false);
    clearFieldErrors("document");
  };

  const getServiceTooltip = (service: string) => {
    if (service === "Post-Scan") return "Scan of Legalized Document";
    if (service === "Pre-Scan") return "Scan of Original Document";
    return null; // Rush or others → no tooltip
  };

  return (
    <>
      <OverlayLoader open={isSubmitting} message="Submitting your order..." />
      <FormLayout
        key={formResetKey}
        title="Dispatch Service"
        onProceed={proceedToCart}
        onCart={addToCart}
        display={true}
      >
        <Grid container spacing={2}>
          {/* Country */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CountrySelect
              label="Select or Type Country"
              required
              value={country}
              error={Boolean(fieldErrors.country)}
              helperText={fieldErrors.country || ""}
              onChange={(value) => {
                setCountry(value);
                clearFieldErrors("country", "document");
              }}
            />
          </Grid>

          {/* Document */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <DocumentDropdown
              label="Select or Type Document"
              country={country}
              value={document}
              required
              pinnedDocTypeIds={[78, 35, 36]}
              onChange={handleDocumentSelect}
              open={dropdownOpen}
              onOpen={() => setDropdownOpen(true)}
              onClose={() => setDropdownOpen(false)}
              disabled={!country}
              error={Boolean(fieldErrors.document)}
              helperText={fieldErrors.document || ""}
            />
          </Grid>

          {/* Customer Reference + Return Instructions (side by side) */}
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <InputField
              label="Customer Reference"
              placeholder="Enter reference number"
              onChange={(e) => setCustomerReference(e.target.value)}
            />
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
                      {additionalServicesState.map((service) => {
                        const tooltipText = getServiceTooltip(service);
                        const checkboxLabel = (
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
                        );
                        return tooltipText ? (
                          <Tooltip
                            key={service}
                            title={tooltipText}
                            arrow
                            placement="top"
                          >
                            {/* span is required because Tooltip needs a single DOM element */}
                            <span>{checkboxLabel}</span>
                          </Tooltip>
                        ) : (
                          checkboxLabel
                        );
                      })}
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

          {/* Upload */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", width: "100%" }}>
              <DocumentUpload
                onChange={handleDocumentUpload}
                country={country}
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

          {/* Additional Comments (multiline) */}
          <Grid size={{ xs: 12, md: 6 }}>
            <InputField
              label="Additional Comments"
              placeholder="Enter comments..."
              multiline
              rows={9}
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
      </FormLayout>
    </>
  );
}
