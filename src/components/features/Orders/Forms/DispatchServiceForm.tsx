"use client";

import React, { useEffect, useState } from "react";
import {
  SelectChangeEvent,
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  OutlinedInput,
  Box,
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
  const { showSnackbar } = useSnackbar();
  // const userId = localStorage.getItem("userId");
  const customerId = localStorage.getItem("customerId");

  const handleDropdownChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: SelectChangeEvent<string>) => {
      setter(event.target.value);
    };

  const handleDocumentUpload = async (data: any) => {
    setNumberOfPages(data?.numberOfPages);
    const file = data?.uploadedFile;
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file_0", file);
        const data = await uploadFile(formData);
        console.log(data);
        setAttachment(data);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const submitOrder = async () => {
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
        });
        const response = await postTranslationOrder(payload);
        console.log("response ----------> ", response);
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
        });
        const response = await updateOrder(payload.orderId, payload);
        console.log("response ----------> ", response);
      }
      window.location.href = "/cart?service=dispatch-service";
    } catch (error) {
      showSnackbar("Failed to submit order", "error");
      console.error(error);
    }
  };

  // Get the previous cart order details.
  const getCartOrder = async () => {
    try {
      const basePayload = CART_SERVICE_MAP["us-authentication"];
      if (!basePayload) {
        return <div>Invalid service selected.</div>;
      }
      const payload = {
        customerId: customerId,
        docCategoryId: 529,
        ...basePayload,
      };
      const orderId = await getOrderIdOfCart(payload);
      if (orderId != null) {
        const response = await getOrderDetails({ orderId: orderId });
        const orderData = response[0];
        setBasePayload(orderData);
        console.log("orderData ---------> ", orderData);
      }
    } catch (error) {
      console.error("Error in getCartOrder:", error);
    }
  };

  useEffect(() => {
    getCartOrder();
  }, []);

  const handleDocumentSelect = (newValue: DocType | null) => {
    if (!newValue) return;
    setDocument(newValue);
    setDisabled(false);
  };

  return (
    <FormLayout title="Dispatch Service" onProceed={submitOrder}>
      <Grid container spacing={2}>
        {/* Country */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <CountrySelect
            label="Select Country *"
            value={country}
            onChange={setCountry}
          />
        </Grid>

        {/* Document */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <DocumentDropdown
            label="Select Document *"
            country={country}
            value={document}
            onChange={handleDocumentSelect}
            open={dropdownOpen}
            onOpen={() => setDropdownOpen(true)}
            onClose={() => setDropdownOpen(false)}
            disabled={!country}
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

        {/* Upload */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: "flex", width: "100%" }}>
            <DocumentUpload onChange={handleDocumentUpload} country={country} />
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
  );
}
