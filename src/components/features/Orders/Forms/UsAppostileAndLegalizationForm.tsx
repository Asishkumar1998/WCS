"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import InputField from "@/components/ui/Input/Input";
import FormLayout from "@/components/ui/Forms/FormLayout";
import { AdditionalServices } from "@/dataset/constants/constants";
import CountrySelect from "@/components/ui/Dropdown/CountryDropdown";
import DocumentDropdown, {
  DocType,
} from "@/components/ui/Dropdown/DocumentDropdown";
import Modal from "@/components/ui/Modal/Modal";
import InfoCard from "../Common/InfoCard";
import DocumentUpload from "../Common/DocumentUpload";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import Loader from "@/components/ui/Loader/Loader";
import { AdditionalQuestions } from "../Common/AdditionalQuestions";
import {
  createUSApostilleOrder,
  getStates,
  uploadFile,
} from "@/services/formsService";
import { useSnackbar } from "@/components/ui/Snakebar/SnackbarProvider";
import { CART_SERVICE_MAP } from "@/constants/serviceMap";
import { getOrderDetails, getOrderIdOfCart } from "@/services/cartServices";
import {
  buildUSApostillePayload,
  buildUSApostillePayloadFromExistingOrder,
} from "../Common/USApostillePayload";
import { updateOrder } from "@/services/paymentService";

const STOP_DOCS_HAGUE_COUNTRIES = [6, 15, 28, 29, 30, 31, 35, 36];
const STOP_DOCS_NON_HAGUE_COUNTRIES = [6, 12, 28, 29, 30, 31, 35, 36];

export default function USAppostileAndLegalizationForm({
  country,
  setCountry,
  document,
  setDocument,
}: {
  country: any;
  setCountry: (value: any) => void;
  document: any;
  setDocument: any;
}) {
  const { loading } = useSelector((state: RootState) => state.formsData);
  // const [country, setCountry] = useState<any>(null);
  // const [document, setDocument] = useState<DocType | null>(null);
  const [additionalServices, setAdditionalServices] = useState<string[]>([]);
  const [modal, setModal] = useState({
    open: false,
    type: "warning" as const,
    message: "",
  });
  const [disabled, setDisabled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [preSubmissionDetailsAvailable, setPreSubmissionDetailsAvailable] =
    useState(false);
  const [infoCardVisible, setInfoCardVisible] = useState(false);
  const [additionalServicesState, setAdditionalServicesState] =
    useState(AdditionalServices);
  const [summaryData, setSummaryData] = useState<Record<string, any>>({});
  const [isNotarized, setIsNotarized] = useState("");
  const [additionalQuestions, setAdditionalQuestions] = useState<any>([]);
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [basePayload, setBasePayload] = useState<any>(null);
  const [states, setStates] = useState<any>();
  const [showCartConflict, setShowCartConflict] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [customerId, setCustomerId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cid = localStorage.getItem("customerId");
      setCustomerId(cid);
    }
  }, []);

  const handleDocumentSelect = (newValue: DocType | null) => {
    if (!newValue) return;

    const id = newValue.docTypeId;
    const countryType = country.countryTypeId === 501 ? "HAGUE" : "NON_HAGUE";

    if (countryType === "HAGUE") {
      // Case 1: STOP PROCESS
      if (STOP_DOCS_HAGUE_COUNTRIES.includes(id)) {
        let warningMessage = "";

        switch (id) {
          case 30:
            warningMessage =
              "The Federal Government document type you selected require originals. Please mail originals to our office.";
            break;
          case 31:
            warningMessage =
              "The Federal Government document type you selected require originals. Please mail originals to our office.";
            break;
          case 35:
            warningMessage =
              "The Federal Government document type you selected require originals. Please mail originals to our office.";
            break;
          case 36:
            warningMessage =
              "The Federal Government document type you selected require originals. Please mail originals to our office.";
            break;
          case 28:
            warningMessage =
              "The Federal Government document type you selected require originals. Please mail originals to our office.";
            break;
          case 15:
            warningMessage =
              "The Federal Government document type you selected require originals. Please mail originals to our office.";
            break;
          case 29:
            warningMessage =
              "The Federal Government document type you selected require originals. Please mail originals to our office.";
            break;
          case 6:
            warningMessage =
              "WCS does not provide services for personal government issued documents for Hague Convention countries. Please have document notarized and certified by the Secretary of State where the document was created.";
            break;
          default:
            warningMessage = "";
            break;
        }

        setModal({
          open: true,
          type: "warning",
          message: warningMessage,
        });
        setDisabled(true);
        setDocument(newValue);
        setDropdownOpen(false);
        return;
      }

      // Case 2: NORMAL FLOW (no popup, no stop)
      if (!STOP_DOCS_HAGUE_COUNTRIES.includes(id)) {
        setDocument(newValue);
        setDisabled(false);
        setModal((prev) => ({ ...prev, open: false }));
      }
    } else {
      // Case 1: STOP PROCESS
      if (STOP_DOCS_NON_HAGUE_COUNTRIES.includes(id)) {
        let warningMessage = "";

        switch (id) {
          case 30:
            warningMessage =
              "The Federal Government document type you selected require originals. Please mail originals to our office.";
            break;
          case 31:
            warningMessage =
              "The Federal Government document type you selected require originals. Please mail originals to our office.";
            break;
          case 35:
            warningMessage =
              "The Federal Government document type you selected require originals. Please mail originals to our office.";
            break;
          case 36:
            warningMessage =
              "The Federal Government document type you selected require originals. Please mail originals to our office.";
            break;
          case 28:
            warningMessage =
              "The Federal Government document type you selected require originals. Please mail originals to our office.";
            break;
          case 15:
            warningMessage =
              "The Federal Government document type you selected require originals. Please mail originals to our office.";
            break;
          case 29:
            warningMessage =
              "The Federal Government document type you selected require originals. Please mail originals to our office.";
            break;
          case 6:
            warningMessage =
              "For this country, all general/personal documents must be notarized and certified by the Secretary of State in the state of origin";
            break;
          default:
            warningMessage = "";
            break;
        }

        setModal({
          open: true,
          type: "warning",
          message: warningMessage,
        });
        setDisabled(true);
        setDocument(newValue);
        setDropdownOpen(false);
        return;
      }

      // Case 2: NORMAL FLOW (no popup, no stop)
      if (!STOP_DOCS_NON_HAGUE_COUNTRIES.includes(id)) {
        setDocument(newValue);
        setDisabled(false);
        setModal((prev) => ({ ...prev, open: false }));
      }
    }
  };

  const handleCountrySelect = (value: any) => {
    setCountry(value);
    setDocument(null);
    setAdditionalServices([]);
  };

  useEffect(() => {
    if (
      (country?.countryShortName === "Kuwait" ||
        country?.countryShortName === "Egypt") &&
      document
    ) {
      setAdditionalServicesState([
        ...AdditionalServices,
        "Optional Arab Chamber Stamp",
      ]);
    } else {
      setAdditionalServicesState([...AdditionalServices]);
    }
  }, [country, document]);

  useEffect(() => {
    if (additionalServices.includes("Rush")) {
      setInfoCardVisible(true);
    } else {
      setInfoCardVisible(false);
    }
  }, [additionalServices]);

  const handleDocumentUpload = async (data: any) => {
    const file: File | null = data?.uploadedFile;
    if (!file) return;

    if (file) {
      try {
        const formData = new FormData();
        formData.append("file_0", file);
        const data = await uploadFile(formData);
        // showSnackbar("Document uploaded successfully", "success");
        setUploadedDoc(data);
      } catch (err) {
        console.log(err);
        showSnackbar("Error while uploading document", "error");
      }
    }
  };

  const submitOrder = async () => {
    if (!country || !document || !uploadedDoc)
      return showSnackbar("Please complete all required fields", "error");

    let payload;
    try {
      const countryId = country?.countryId;
      const docCategoryId = document?.docCategoryId;
      const docTypeId = document?.docTypeId;
      if (basePayload == null) {
        payload = buildUSApostillePayload({
          countryId,
          docCategoryId,
          additionalServices,
          uploadedDoc,
          docTypeId,
          originState: additionalQuestions.find((q: any) => q.questionId === 2)
            ?.answer,
          nusaccRequired:
            additionalQuestions.find((q: any) => q.questionId === 8)?.answer ===
            "Yes"
              ? true
              : false,
        });
        await createUSApostilleOrder(payload);
        showSnackbar("Order created successfully", "success");
      } else {
        payload = buildUSApostillePayloadFromExistingOrder({
          basePayload,
          countryId,
          docCategoryId,
          additionalServices,
          uploadedDoc,
          docTypeId,
        });
        await updateOrder(payload.orderId, payload);
      }
      window.location.href = "/cart?service=us-authentication";
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

  const fetchStates = async () => {
    try {
      const response = await getStates();
      setStates(response);
    } catch (e) {
      console.log("Failed to fetch states.", e);
    }
  };

  useEffect(() => {
    if (customerId) {
      getCartOrder();
    }
    fetchStates();
  }, [customerId]);

  useEffect(() => {
    additionalQuestions.find((q: any) => q.questionId === 1)?.answer === "No"
      ? setShowCartConflict(true)
      : null;
  }, [additionalQuestions]);

  if (loading) return <Loader />;

  return (
    <>
      <Dialog open={showCartConflict} disableEscapeKeyDown onClose={() => {}}>
        <DialogTitle>Notarization Required</DialogTitle>

        <DialogContent>
          <Typography>
            Please have your document <strong>signed and notarized</strong> from
            the <strong> U.S. address mentioned on the document</strong>.
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Once notarization is completed, you may contact us to proceed with
            further processing of your order.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              setAdditionalQuestions((prev: any) =>
                prev.filter((item: any) => item.questionId !== 1)
              );
              setShowCartConflict(false);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <FormLayout
        title="U.S. Apostilles and Legalizations"
        country={country}
        document={document}
        onProceed={submitOrder}
      >
        <Grid alignItems="stretch" container spacing={2}>
          {/* Country */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CountrySelect
              label="Select Country *"
              value={country}
              onChange={handleCountrySelect}
            />
          </Grid>

          {/* Service */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <InputField
              label="Selected Service"
              placeholder="Please select a country"
              value={
                country?.countryTypeId == 502
                  ? "Legalization"
                  : country?.countryTypeId == 501
                  ? "Apostille"
                  : ""
              }
              slotProps={{
                input: {
                  readOnly: true,
                  sx: { fontWeight: 700 },
                },
              }}
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

          {/* Additional Details (with floating label) */}
          <Grid size={{ xs: 12, md: 12, sm: 6 }}>
            <AdditionalQuestions
              country={country}
              states={states}
              setAdditionalPreferences={setAdditionalQuestions}
              resetQuestionId={showCartConflict ? 1 : null}
            />
          </Grid>

          {/* Document Upload (takes full width on mobile, half on md+) */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", width: "100%" }}>
              <DocumentUpload
                onChange={handleDocumentUpload}
                country={country}
              />
            </Box>
          </Grid>

          {/* Additional Comments */}
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <InputField
              label="Additional Comments"
              placeholder="Enter comments..."
              disabled={disabled}
              multiline
              minRows={9}
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

          {/* <InfoCard
            message="Selecting Rush/Expedited as additional service will skip US Department of State authentication for Egypt & Kuwait ,UAE ,Lebanon (General document only), and Vietnam (General and Federal Government document)."
            visible={infoCardVisible}
          /> */}

          {/* Customer Reference */}
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <InputField
              label="Customer Reference"
              placeholder="Enter reference number"
              disabled={disabled}
            />
          </Grid>
        </Grid>

        <Modal
          open={modal.open}
          onClose={() => setModal((prev) => ({ ...prev, open: false }))}
          type={modal.type}
          title="Document Restriction"
          message={modal.message}
          confirmText="OK"
          onConfirm={() => setModal((prev) => ({ ...prev, open: false }))}
        />
      </FormLayout>
    </>
  );
}
