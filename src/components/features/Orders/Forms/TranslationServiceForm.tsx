"use client";

import React, { useState } from "react";
import { Grid, SelectChangeEvent } from "@mui/material";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import InputField from "@/components/ui/Input/Input";
import FileUploadField from "@/components/ui/Input/FileInput";
import FormLayout from "@/components/ui/Forms/FormLayout";

const languages = ["English", "Spanish", "French", "German", "Arabic"];
const docsCount = ["1", "2", "3", "4", "5"];
const payments = ["Credit Card", "PayPal", "Bank Transfer"];

export default function TranslationServiceForm() {
  const [originalLang, setOriginalLang] = useState("");
  const [translatedLang, setTranslatedLang] = useState("");
  const [docs, setDocs] = useState("");
  const [payment, setPayment] = useState("");

  const handleDropdownChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: SelectChangeEvent<string>) => {
      setter(event.target.value);
    };

  return (
    <FormLayout title="Translation Service">
      {/* Original + Translated Language */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Dropdown
          label="Original Language *"
          options={languages}
          value={originalLang}
          onChange={handleDropdownChange(setOriginalLang)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Dropdown
          label="Translated Language *"
          options={languages}
          value={translatedLang}
          onChange={handleDropdownChange(setTranslatedLang)}
        />
      </Grid>

      {/* Number of Docs */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Dropdown
          label="Number of Docs *"
          options={docsCount}
          value={docs}
          onChange={handleDropdownChange(setDocs)}
        />
      </Grid>

      {/* Upload Docs */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <FileUploadField label="Upload Docs *" />
      </Grid>

      {/* Reference */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <InputField
          label="Customer Reference"
          placeholder="Add Customer Reference Number"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <InputField
          label="Return Instructions *"
          placeholder="Shipping Label/Return Instructions"
        />
      </Grid>

      {/* Comments */}
      <Grid size={{ xs: 12 }}>
        <InputField
          label="Additional Comments"
          placeholder="Add Additional Comments"
          multiline
          rows={3}
        />
      </Grid>

      {/* Return + Payment */}

      <Grid size={{ xs: 12, sm: 6, md: 12 }}>
        <Dropdown
          label="Payment *"
          options={payments}
          value={payment}
          onChange={handleDropdownChange(setPayment)}
        />
      </Grid>
    </FormLayout>
  );
}
