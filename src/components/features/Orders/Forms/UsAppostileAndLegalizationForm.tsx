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
} from "@mui/material";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import InputField from "@/components/ui/Input/Input";
import FormLayout from "@/components/ui/Forms/FormLayout";
import { AdditionalServices, Services } from "@/dataset/constants/constants";
import CountrySelect from "@/components/ui/Dropdown/CountryDropdown";
import { documentTypes } from "@/dataset/document_types";
import DocumentDropdown, {
  DocType,
} from "@/components/ui/Dropdown/DocumentDropdown";
import Modal from "@/components/ui/Modal/Modal";
import HagueDocUpload from "../Dialogs/HagueDocUpload";
import NonHagueDocUpload from "../Dialogs/NonHagueDocUpload";
import InfoCard from "../Common/InfoCard";
import DocumentUpload from "../Common/DocumentUpload";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import Loader from "@/components/ui/Loader/Loader";

const payments = ["Credit Card", "PayPal", "Bank Transfer"];

const STOP_DOCS_HAGUE_COUNTRIES = [6, 15, 28, 29, 30, 31, 35, 36];
const STOP_DOCS_NON_HAGUE_COUNTRIES = [6, 12, 28, 29, 30, 31, 35, 36];

function SummaryStep({ stepData }: { stepData: Record<string, any> }) {
  const relevantKeys = [
    "Notarized & certified in your state?",
    "Document from another state?",
    "U.S. Dept. of State certified?",
  ];

  const filteredData = relevantKeys
    .map((key) => [key, stepData[key]])
    .filter(([_, v]) => v !== undefined && v !== "");

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          mt: 2,
        }}
      >
        {filteredData.map(([key, value]) => (
          <Box
            key={key}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1,
              bgcolor: "white",
              borderRadius: 1,
              boxShadow: "0 0 3px rgba(0,0,0,0.05)",
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>{key}</Typography>
            <Typography
              sx={{
                color: value === "yes" ? "success.main" : "error.main",
                textTransform: "capitalize",
              }}
            >
              {value || "-"}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

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
  const [uploadDocumentModalOpen, setUploadDocumentModalOpen] = useState(false);
  const [uploadButtonDisabled, setUploadButtonDisabled] = useState(true);
  const [preSubmissionDetailsAvailable, setPreSubmissionDetailsAvailable] =
    useState(false);
  const [filteredDocuments, setFilteredDocuments] =
    useState<DocType[]>(documentTypes);
  const [infoCardVisible, setInfoCardVisible] = useState(false);
  const [additionalServicesState, setAdditionalServicesState] =
    useState(AdditionalServices);
  const [summaryData, setSummaryData] = useState<Record<string, any>>({});

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
        setUploadButtonDisabled(true);
        setDocument(newValue);
        setDropdownOpen(false);
        return;
      }

      // 🔹 Case 2: NORMAL FLOW (no popup, no stop)
      if (!STOP_DOCS_HAGUE_COUNTRIES.includes(id)) {
        setDocument(newValue);
        setDisabled(false);
        setUploadButtonDisabled(false);
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
        setUploadButtonDisabled(true);
        setDocument(newValue);
        setDropdownOpen(false);
        return;
      }

      // 🔹 Case 2: NORMAL FLOW (no popup, no stop)
      if (!STOP_DOCS_NON_HAGUE_COUNTRIES.includes(id)) {
        setDocument(newValue);
        setDisabled(false);
        setUploadButtonDisabled(false);
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
    if (country) {
      if (country.isShipping === 0) {
        setFilteredDocuments(
          documentTypes.filter((doc) => doc.docCategoryId !== 523)
        );
      } else {
        setFilteredDocuments(documentTypes);
      }
    } else {
      setFilteredDocuments(documentTypes);
    }
  }, [country]);

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

  if (loading) return <Loader />;

  return (
    <FormLayout title="U.S. Apostilles and Legalizations">
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: "4px",
              gap: 1,
              padding: "15px",
            }}
          >
            <Typography sx={{ fontWeight: 500 }}>Selected Service:</Typography>
            <Typography color="primary" sx={{ fontWeight: 600 }}>
              {"Appostile"}
            </Typography>
          </Box>
        </Grid>

        {/* Document */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <DocumentDropdown
            label="Select Document *"
            options={filteredDocuments}
            value={document}
            onChange={handleDocumentSelect}
            open={dropdownOpen}
            onOpen={() => setDropdownOpen(true)}
            onClose={() => setDropdownOpen(false)}
            disabled={country ? false : true}
          />
        </Grid>
        {/*Additional Services */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Grid
            container
            alignItems="center"
            sx={{
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: "4px",
              padding: "6px 14px",
            }}
          >
            <Grid>{/* <Typography>Add. Services</Typography> */}</Grid>
            <Grid>
              <FormGroup
                row
                sx={{
                  flexWrap: "nowrap",
                  overflowX: "auto",
                  "& .MuiFormControlLabel-label": {
                    fontSize: { xs: "0.8rem", sm: "0.9rem" },
                    lineHeight: "16px",
                  },
                  "& .MuiCheckbox-root": {
                    padding: "8px",
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
            </Grid>
          </Grid>
        </Grid>

        {/* Document Upload */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex" }}>
          <Box sx={{ flex: 1 }}>
            <DocumentUpload country={country} />
          </Box>
        </Grid>

        {/* Upload Section */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex" }}>
          <Box
            sx={{
              flex: 1,
              bgcolor: "#fafbfc",
              borderRadius: 2,
              px: 2,
              py: 1,
              border: "1px solid rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 1,
                fontSize: "1.05rem",
                fontWeight: 600,
                color: "#333",
              }}
            >
              Additional Details
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setUploadDocumentModalOpen(true)}
              disabled={uploadButtonDisabled || !preSubmissionDetailsAvailable}
              sx={{
                width: "100%",
                "&.Mui-disabled": { color: "grey.500" },
              }}
            >
              Select Additional Details
            </Button>

            <Box sx={{ flex: 1, overflow: "auto" }}>
              <SummaryStep stepData={summaryData} />
            </Box>

            {/* Conditional Modals for Hague / Non-Hague */}
            {country?.countryTypeId === 501 ? (
              <HagueDocUpload
                open={uploadDocumentModalOpen}
                setOpen={setUploadDocumentModalOpen}
                country={country}
                documentType={document?.docCategoryId}
                onStepsAvailableChange={setPreSubmissionDetailsAvailable}
                onValueChange={handleValueChange}
              />
            ) : country?.countryTypeId === 502 ? (
              <NonHagueDocUpload
                open={uploadDocumentModalOpen}
                setOpen={setUploadDocumentModalOpen}
                country={country}
                documentType={document?.docCategoryId}
                onStepsAvailableChange={setPreSubmissionDetailsAvailable}
                onValueChange={handleValueChange}
              />
            ) : null}
          </Box>
        </Grid>

        <InfoCard
          message="Selecting Rush/Expedited as additional service will skip US Department of State authentication for Egypt & Kuwait ,UAE ,Lebanon (General document only), and Vietnam (General and Federal Government document)."
          visible={infoCardVisible}
        />

        {/* Customer Reference + Return Instructions (side by side) */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <InputField
            label="Customer Reference"
            placeholder="Enter reference number"
            disabled={disabled}
          />
        </Grid>

        {/* Additional Comments (multiline) */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <InputField
            label="Additional Comments"
            placeholder="Enter comments..."
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
