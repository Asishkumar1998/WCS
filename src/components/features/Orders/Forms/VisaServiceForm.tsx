"use client";

import React, { useState } from "react";
import { Grid, SelectChangeEvent } from "@mui/material";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import InputField from "@/components/ui/Input/Input";
import FileUploadField from "@/components/ui/Input/FileInput";
import FormLayout from "@/components/ui/Forms/FormLayout";
import DateInput from "@/components/ui/Input/DateInput";
import CountrySelect from "@/components/ui/Dropdown/CountryDropdown";
import ValidatedFileUpload from "../Common/ValidatedFileUpload";
import DocumentUpload from "../Common/DocumentUpload";

const visaTypes = ["Tourist", "Business", "Work", "Student"];
const passportTypes = ["Regular", "Diplomatic", "Official"];
const states = ["California", "New York", "Texas", "Florida"];
const entries = ["Single Entry", "Double Entry", "Multiple Entry"];

export default function VisaServiceForm() {
  const [destinationCountry, setDestinationCountry] = useState<any>(null);
  const [visaType, setVisaType] = useState("");
  const [passportType, setPassportType] = useState("");
  const [originCountry, setOriginCountry] = useState<any>(null);
  const [residenceState, setResidenceState] = useState("");
  const [entryType, setEntryType] = useState("");

  const handleDropdownChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: SelectChangeEvent<string>) => {
      setter(event.target.value);
    };

  return (
    <FormLayout title="Visa Service">
      {/* Destination Country */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <CountrySelect
          label="Destination Country for Visa *"
          value={destinationCountry}
          onChange={setDestinationCountry}
        />
      </Grid>

      {/* Visa Type */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Dropdown
          label="Type of Visa *"
          options={visaTypes}
          value={visaType}
          onChange={() => handleDropdownChange(setVisaType)}
        />
      </Grid>

      {/* Passport Type */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Dropdown
          label="Type of Passport *"
          options={passportTypes}
          value={passportType}
          onChange={() => handleDropdownChange(setPassportType)}
        />
      </Grid>

      {/* Origin Country */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <CountrySelect
          label="Origin Country of Passport *"
          value={originCountry}
          onChange={setOriginCountry}
        />
      </Grid>

      {/* Applicant Name */}
      <Grid size={{ xs: 12 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <InputField label="First Name *" />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <InputField label="Middle Name" />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <InputField label="Last Name *" />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <InputField label="Suffix" />
          </Grid>
        </Grid>
      </Grid>

      {/* Passport Number */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <InputField label="Passport Number *" />
      </Grid>

      {/* Dates */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <DateInput label="Date of Issue *" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <DateInput label="Passport Validity (good until) *" />
      </Grid>

      {/* State of Residence */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Dropdown
          label="Applicant State of Residence *"
          options={states}
          value={residenceState}
          onChange={() => handleDropdownChange(setResidenceState)}
        />
      </Grid>

      {/* Entry Type */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Dropdown
          label="Number of Entry/IES *"
          options={entries}
          value={entryType}
          onChange={() => handleDropdownChange(setEntryType)}
        />
      </Grid>

      {/* Departure + Expedited */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <DateInput label="Date of Departure from U.S *" />
      </Grid>

      {/* Upload Docs */}
      <Grid size={{ xs: 12, md: 6 }}>
        <DocumentUpload country={""} />
      </Grid>

      {/* Comments */}
      <Grid size={{ xs: 12, md: 6 }}>
        <InputField label="Additional Comments" multiline rows={9} />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <DateInput label="Expedited Service (Date Needed By)" />
      </Grid>

      {/* Reference */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <InputField label="Customer Reference" />
      </Grid>
    </FormLayout>
  );
}
