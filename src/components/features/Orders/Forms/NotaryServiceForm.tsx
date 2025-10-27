"use client";

import React, { useState } from "react";
import {
  SelectChangeEvent,
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import InputField from "@/components/ui/Input/Input";
import FileUploadField from "@/components/ui/Input/FileInput";
import FormLayout from "@/components/ui/Forms/FormLayout";
import { AdditionalServices } from "@/dataset/constants/constants";
import CountrySelect from "@/components/ui/Dropdown/CountryDropdown";

const documents = ["Passport", "Certificate", "License"];
const payments = ["Credit Card", "PayPal", "Bank Transfer"];

export default function NotaryServiceForm() {
  const [country, setCountry] = useState<any>(null);
  const [document, setDocument] = useState("");
  const [additionalServices, setAdditionalServices] = useState<string[]>([]);
  const [payment, setPayment] = useState("");
  const [additionalServicesState, setAdditionalServicesState] =
    useState(AdditionalServices);
  const [disabled, setDisabled] = useState(false);

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
          <CountrySelect
            label="Select Country *"
            value={country}
            onChange={setCountry}
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
        {/* <Grid size={{ xs: 12, sm: 6 }}>
          <Dropdown
            label="Additional Service"
            options={AdditionalServices}
            value={additionalServices}
            onChange={setAdditionalServices}
            multiple
          />
        </Grid> */}
        <Grid size={{ xs: 12 }}>
          <div
            style={{
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: "8px",
              padding: "16px 20px",
              backgroundColor: "#fafbfc",
              width: "100%",
            }}
          >
            <h4
              style={{
                fontSize: "1.05rem",
                fontWeight: 600,
                marginBottom: "12px",
                color: "#333",
              }}
            >
              Additional Services
            </h4>

            <FormGroup
              style={{
                paddingLeft: "4px", // keeps checkboxes visually aligned with title
              }}
            >
              <Grid container spacing={1.5}>
                {additionalServicesState.map((service) => (
                  <Grid key={service} size={{ xs: 12, sm: 6, md: 4 }}>
                    <FormControlLabel
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
                          sx={{
                            color: "#1a73e8",
                            "&.Mui-checked": {
                              color: "#1a73e8",
                            },
                          }}
                        />
                      }
                      label={service}
                      sx={{
                        border: "1px solid rgba(0,0,0,0.12)",
                        borderRadius: "8px",
                        px: 1.5,
                        py: 0.75,
                        width: "100%",
                        backgroundColor: "#fff",
                        display: "flex",
                        alignItems: "center",
                        transition: "background-color 0.2s ease",
                        "&:hover": {
                          backgroundColor: "#f7f9fc",
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </FormGroup>
          </div>
        </Grid>

        {/* Customer Reference + Return Instructions (side by side) */}
        <Grid size={{ xs: 12, sm: 6, md: 12 }}>
          <InputField
            label="Customer Reference"
            placeholder="Enter reference number"
          />
        </Grid>
        {/* <Grid size={{ xs: 12, sm: 6 }}>
          <InputField
            label="Return Instructions"
            placeholder="e.g. Shipping label details"
          />
        </Grid> */}

        {/* Payment */}
        {/* <Grid size={{ xs: 12, sm: 6 }}>
          <Dropdown
            label="Payment Method *"
            options={payments}
            value={payment}
            onChange={() => handleDropdownChange(setPayment)}
          />
        </Grid> */}

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
