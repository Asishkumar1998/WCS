"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  SelectChangeEvent,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import InputField from "@/components/ui/Input/Input";
import FileUploadField from "@/components/ui/Input/FileInput";
import FormLayout from "@/components/ui/Forms/FormLayout";
import { AdditionalServices, Services } from "@/dataset/constants/constants";
import CountrySelect from "@/components/ui/Dropdown/CountryDropdown";
import { documentTypes } from "@/dataset/document_types";
import DocumentDropdown, {
  DocType,
} from "@/components/ui/Dropdown/DocumentDropdown";
import Modal from "@/components/ui/Modal/Modal";
import UploadDocumentsModal from "../Dialogs/UploadDocumentsDialog";

const payments = ["Credit Card", "PayPal", "Bank Transfer"];

const STOP_DOCS = [6, 15, 28, 29, 30, 31, 35, 36];
const NORMAL_DOCS = [16, 77];

export default function USAppostileAndLegalizationForm() {
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

  const handleDropdownChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: SelectChangeEvent<string>) => {
      setter(event.target.value);
    };

  const handleDocumentSelect = (newValue: DocType | null) => {
    if (!newValue) return;

    const id = newValue.docTypeId;

    // 🔸 Case 1: STOP PROCESS
    if (STOP_DOCS.includes(id)) {
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
    if (NORMAL_DOCS.includes(id) || !STOP_DOCS.includes(id)) {
      setDocument(newValue);
      setDisabled(false);
      setUploadButtonDisabled(false);
      setModal((prev) => ({ ...prev, open: false }));
    }
  };

  const uploadDocuments = () => {};

  return (
    <FormLayout title="U.S. Apostilles and Legalizations">
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
            options={documentTypes}
            value={document}
            onChange={handleDocumentSelect}
            open={dropdownOpen}
            onOpen={() => setDropdownOpen(true)}
            onClose={() => setDropdownOpen(false)}
            disabled={country ? false : true}
          />
        </Grid>

        {/* Upload */}
        <Grid size={{ xs: 12 }}>
          {/* <FileUploadField label="Upload Document *" disabled={disabled} /> */}
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setUploadDocumentModalOpen(true)}
            disabled={uploadButtonDisabled}
            sx={{
              width: "100%",
              py: 1,
              "&.Mui-disabled": {
                color: "grey.500",
              },
            }}
          >
            Upload Documents
          </Button>
          <UploadDocumentsModal
            open={uploadDocumentModalOpen}
            setOpen={setUploadDocumentModalOpen}
          />
        </Grid>

        {/* Service */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Dropdown
            label="Select Service *"
            options={Services}
            value={service}
            onChange={() => handleDropdownChange(setService)}
            disabled={disabled}
          />
        </Grid>

        {/* Additional Service */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Dropdown
            label="Additional Service"
            options={AdditionalServices}
            value={additionalServices}
            onChange={setAdditionalServices}
            multiple
            disabled={disabled}
          />
        </Grid>

        {/* Customer Reference + Return Instructions (side by side) */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <InputField
            label="Customer Reference"
            placeholder="Enter reference number"
            disabled={disabled}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <InputField
            label="Return Instructions"
            placeholder="e.g. Shipping label details"
            disabled={disabled}
          />
        </Grid>

        {/* Additional Comments (multiline) */}
        <Grid size={{ xs: 12 }}>
          <InputField
            label="Additional Comments"
            placeholder="Enter comments..."
            multiline
            rows={3}
            disabled={disabled}
          />
        </Grid>

        {/* Payment */}
        <Grid size={{ xs: 12 }}>
          <Dropdown
            label="Payment Method *"
            options={payments}
            value={payment}
            onChange={() => handleDropdownChange(setPayment)}
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
