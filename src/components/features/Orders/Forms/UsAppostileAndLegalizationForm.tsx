"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  SelectChangeEvent,
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  RadioGroup,
  Radio,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import InputField from "@/components/ui/Input/Input";
import FormLayout from "@/components/ui/Forms/FormLayout";
import { AdditionalServices, Services } from "@/dataset/constants/constants";
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
import { createUSApostilleOrder, uploadFile } from "@/services/formsService";
import { useSnackbar } from "@/components/ui/Snakebar/SnackbarProvider";

const payments = ["Credit Card", "PayPal", "Bank Transfer"];

const STOP_DOCS_HAGUE_COUNTRIES = [6, 15, 28, 29, 30, 31, 35, 36];
const STOP_DOCS_NON_HAGUE_COUNTRIES = [6, 12, 28, 29, 30, 31, 35, 36];

const CUSTOMERID = 9682;
const USERID = 7437;

export default function USAppostileAndLegalizationForm() {
  const { loading } = useSelector((state: RootState) => state.formsData);
  const [country, setCountry] = useState<any>(null);
  const [document, setDocument] = useState<DocType | null>(null);
  const [service, setService] = useState("");
  const [additionalServices, setAdditionalServices] = useState<string[]>([]);
  const [payment, setPayment] = useState("");
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
  const [additionalQuestions, setAdditionalQuestions] = useState([]);
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const { showSnackbar } = useSnackbar();

  const handleValueChange = (key: string, value: any) => {
    setSummaryData((prev) => ({
      ...prev,
      [key]: value, // update or add key
    }));
  };

  const handleDropdownChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: SelectChangeEvent<string>) => {
      setter(event.target.value);
    };

  const handleDocumentSelect = (newValue: DocType | null) => {
    if (!newValue) return;

    const id = newValue.docTypeId;
    const countryType = country.countryTypeId === 501 ? "HAGUE" : "NON_HAGUE";

    if (countryType === "HAGUE") {
      // 🔸 Case 1: STOP PROCESS
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

      // 🔹 Case 2: NORMAL FLOW (no popup, no stop)
      if (!STOP_DOCS_HAGUE_COUNTRIES.includes(id)) {
        setDocument(newValue);
        setDisabled(false);
        setModal((prev) => ({ ...prev, open: false }));
      }
    } else {
      // 🔸 Case 1: STOP PROCESS
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

      // 🔹 Case 2: NORMAL FLOW (no popup, no stop)
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
    const file = data?.uploadedFile;
    console.log("file ----------> ", file);
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file_0", file);
        const data = await uploadFile(formData);
        showSnackbar("Document uploaded successfully", "success");
        setUploadedDoc(data);
      } catch (err) {
        console.log(err);
        showSnackbar("Error while uploading document", "error");
      }
    }
  };

  console.log(country);
  console.log(document);
  console.log(additionalServices);

  const submitOrder = async () => {
    if (!country || !document || !uploadedDoc)
      return showSnackbar("Please complete all required fields", "error");

    const payload = {
      customerId: CUSTOMERID,
      orderOriginId: 611,
      orderType: 1101,
      initiatedBy: USERID,
      dockets: [
        {
          docs: [
            {
              countryId: country?.countryId,
              originCountryId: 190,
              docCategoryId: document?.docCategoryId,
              isRush: additionalServices.includes("Rush"),
              isScan: additionalServices.includes("Pre-Scan"),
              isDispatch: false,
              isNotarized: 652,
              isPostScan: additionalServices.includes("Post-Scan"),
              isCopy: false,
              isSoSDone: 652,
              isDoSDone: 652,
              noOfProducts: null,
              isSoftCopyGiven: 651,
              attachments: uploadedDoc,
              isGeneralSoftCopy: 651,
              isPhotocopyInclude: 651,
              CIAmount: "0",
              additionalDOX: "",
              COCount: 0,
              CICount: 1,
              docTypeId: document?.docTypeId,
            },
          ],
        },
      ],
    };

    try {
      const data = await createUSApostilleOrder(payload);
      showSnackbar("Order created successfully", "success");
      console.log(data);
    } catch (error) {
      showSnackbar("Failed to submit order", "error");
      console.error(error);
    }
  };

  if (loading) return <Loader />;

  return (
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
            value={country?.countryTypeId == 502 ? "Legalization" : "Apostille"}
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

        {/* Additional Details (with floating label) */}
        <Grid size={{ xs: 12, md: 12, sm: 6 }}>
          <AdditionalQuestions
            country={country}
            setAdditionalPreferences={setAdditionalQuestions}
          />
        </Grid>

        {/* Document Upload (takes full width on mobile, half on md+) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: "flex", width: "100%" }}>
            <DocumentUpload onChange={handleDocumentUpload} country={country} />
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

        <InfoCard
          message="Selecting Rush/Expedited as additional service will skip US Department of State authentication for Egypt & Kuwait ,UAE ,Lebanon (General document only), and Vietnam (General and Federal Government document)."
          visible={infoCardVisible}
        />

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
  );
}
