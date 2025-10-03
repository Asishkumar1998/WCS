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

const mockCountries = ["USA", "Canada", "Kuwait", "India"];
const documents = ["Passport", "Certificate", "License"];
const payments = ["Credit Card", "PayPal", "Bank Transfer"];

export default function BulkOrderingFormTypeOne() {
  const [countries, setCountries] = useState<string[]>([]);
  const [document, setDocument] = useState("");
  const [service, setService] = useState("");
  const [additionalServices, setAdditionalServices] = useState<string[]>([]);
  const [payment, setPayment] = useState("");

  const handleDropdownChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: SelectChangeEvent<string>) => {
      setter(event.target.value);
    };

  return (
    <FormLayout title="Bulk Ordering - Add single document for multiple countries.">
      <Grid container spacing={2}>
        {/* Document */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Dropdown
            label="Select Document *"
            options={documents}
            value={document}
            onChange={() => handleDropdownChange(setDocument)}
          />
        </Grid>
        {/* Country */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Dropdown
            label="Select Countries"
            options={mockCountries}
            value={countries}
            onChange={setCountries}
            multiple
          />
        </Grid>
        {/* Upload */}
        <Grid size={{ xs: 12 }}>
          <FileUploadField label="Upload Document *" />
        </Grid>

        {/* Service */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Dropdown
            label="Select Service *"
            options={Services}
            value={service}
            onChange={() => handleDropdownChange(setService)}
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

        {/* Additional Comments (multiline) */}
        <Grid size={{ xs: 12 }}>
          <InputField
            label="Additional Comments"
            placeholder="Enter comments..."
            multiline
            rows={3}
          />
        </Grid>

        {/* Payment */}
        <Grid size={{ xs: 12 }}>
          <Dropdown
            label="Payment Method *"
            options={payments}
            value={payment}
            onChange={() => handleDropdownChange(setPayment)}
          />
        </Grid>
      </Grid>
    </FormLayout>
  );
}
