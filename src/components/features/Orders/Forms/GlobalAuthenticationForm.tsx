"use client";

import React, { useState } from "react";
import { Grid, SelectChangeEvent } from "@mui/material";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import InputField from "@/components/ui/Input/Input";
import FileUploadField from "@/components/ui/Input/FileInput";
import FormLayout from "@/components/ui/Forms/FormLayout";
import CountrySelect from "@/components/ui/Dropdown/CountryDropdown";
import DocumentUpload from "../Common/DocumentUpload";

const docsCount = ["1", "2", "3", "4", "5"];
const payments = ["Credit Card", "PayPal", "Bank Transfer"];

export default function GlobalAuthenticationForm() {
  const [origin, setOrigin] = useState<any>(null);
  const [destination, setDestination] = useState<any>(null);
  const [docs, setDocs] = useState("");
  const [payment, setPayment] = useState("");

  const handleDropdownChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: SelectChangeEvent<string>) => {
      setter(event.target.value);
    };

  return (
    <FormLayout title="Global Authentication">
      {/* Origin + Destination */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <CountrySelect
          label="Origin Country *"
          value={origin}
          onChange={setOrigin}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <CountrySelect
          label="Destination Country *"
          value={destination}
          onChange={setDestination}
        />
      </Grid>

      {/* Docs Count */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Dropdown
          label="Number of Docs *"
          options={docsCount}
          value={docs}
          onChange={() => handleDropdownChange(setDocs)}
        />
      </Grid>

      {/* Reference */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <InputField
          label="Customer Reference"
          placeholder="Add Customer Reference Number"
        />
      </Grid>

      {/* Upload */}
      <Grid size={{ xs: 12, md: 6 }}>
        <DocumentUpload country={"Qatar"} />
      </Grid>

      {/* Comments */}
      <Grid size={{ xs: 12, md: 6 }}>
        <InputField
          label="Additional Comments"
          placeholder="Add Additional Comments"
          multiline
          rows={9}
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
    </FormLayout>
  );
}
