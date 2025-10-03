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

const countries = ["USA", "Canada", "Kuwait", "India"];
const documents = ["Passport", "Certificate", "License"];
const services = ["Apostille", "Authentication", "Translation"];
const additionalServices = ["Courier", "Notary", "Legalization"];
const payments = ["Credit Card", "PayPal", "Bank Transfer"];

export default function NotaryServiceForm() {
  const [country, setCountry] = useState("");
  const [document, setDocument] = useState("");
  const [service, setService] = useState("");
  const [additionalService, setAdditionalService] = useState("");
  const [payment, setPayment] = useState("");

  const handleDropdownChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: SelectChangeEvent<string>) => {
      setter(event.target.value);
    };

  return (
    <FormLayout title="Notary Service">
      <Grid container spacing={2}>
        {/* Country */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Dropdown
            label="Select Country *"
            options={countries}
            value={country}
            onChange={() => handleDropdownChange(setCountry)}
          />
        </Grid>

        {/* Document */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Dropdown
            label="Select Document *"
            options={documents}
            value={document}
            onChange={() => handleDropdownChange(setDocument)}
          />
        </Grid>

        {/* Upload */}
        <Grid size={{ xs: 12 }}>
          <FileUploadField label="Upload Document *" />
        </Grid>

        {/* Additional Service */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Dropdown
            label="Additional Service"
            options={additionalServices}
            value={additionalService}
            onChange={() => handleDropdownChange(setAdditionalService)}
          />
        </Grid>

        {/* Customer Reference + Return Instructions (side by side) */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <InputField
            label="Customer Reference"
            placeholder="Enter reference number"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <InputField
            label="Return Instructions"
            placeholder="e.g. Shipping label details"
          />
        </Grid>

        {/* Payment */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Dropdown
            label="Payment Method *"
            options={payments}
            value={payment}
            onChange={() => handleDropdownChange(setPayment)}
          />
        </Grid>

        {/* Additional Comments (multiline) */}
        <Grid size={{ xs: 12 }}>
          <InputField
            label="Additional Comments"
            placeholder="Enter comments..."
            multiline
            rows={3}
          />
        </Grid>
      </Grid>
    </FormLayout>
  );
}
