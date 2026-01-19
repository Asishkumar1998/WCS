"use client";

import React, { useEffect, useState } from "react";
import {
  SelectChangeEvent,
  Grid,
  Checkbox,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Alert,
} from "@mui/material";
import InputField from "@/components/ui/Input/Input";
import FormLayout from "@/components/ui/Forms/FormLayout";
import CountrySelect from "@/components/ui/Dropdown/CountryDropdown";
import DocumentUpload from "../Common/DocumentUpload";
import DocumentDropdown from "@/components/ui/Dropdown/DocumentDropdown";
import { DocType } from "./NotaryServiceForm";

type ServiceType = "preScan" | "postScan" | "rush";

const SERVICES: { key: ServiceType; label: string }[] = [
  { key: "preScan", label: "Pre-Scan" },
  { key: "postScan", label: "Post-Scan" },
  { key: "rush", label: "Rush" },
];

type ServiceMapping = Record<
  string,
  {
    preScan: boolean;
    postScan: boolean;
    rush: boolean;
  }
>;

export default function BulkOrderingFormTypeOne() {
  const [countries, setCountries] = useState<any>([]);
  const [document, setDocument] = useState<DocType | null>(null);
  const [serviceMapping, setServiceMapping] = useState<ServiceMapping>({});
  const [disabled, setDisabled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Initialize service mapping per country
  useEffect(() => {
    setServiceMapping((prev) => {
      const updated: ServiceMapping = {};

      countries.forEach((country: any) => {
        const key = country.countryShortName;

        updated[key] = prev[key] ?? {
          preScan: false,
          postScan: false,
          rush: false,
        };
      });

      return updated;
    });
  }, [countries]);

  const handleDropdownChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: SelectChangeEvent<string>) => {
      setter(event.target.value);
    };

  const toggleService = (country: string, service: ServiceType) => {
    setServiceMapping((prev) => ({
      ...prev,
      [country]: {
        ...prev[country],
        [service]: !prev[country]?.[service],
      },
    }));
  };

  const handleDocumentSelect = (newValue: DocType | null) => {
    if (!newValue) return;
    setDocument(newValue);
    setDisabled(false);
  };

  return (
    <FormLayout title="Bulk Ordering - Add single document for multiple countries.">
      <Grid container spacing={2}>
        {/* Document */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <DocumentDropdown
            label="Select Document"
            value={document}
            required
            onChange={handleDocumentSelect}
            open={dropdownOpen}
            onOpen={() => setDropdownOpen(true)}
            onClose={() => setDropdownOpen(false)}
          />
        </Grid>

        {/* Country */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <CountrySelect
            label="Select Countries"
            value={countries}
            onChange={setCountries}
            multiple
            disabledCountryIds={[
              3, 53, 82, 88, 93, 97, 130, 144, 196, 199, 205,
            ]}
          />
        </Grid>

        {/* Additional Services Mapping */}
        {countries.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
              Map Additional Services to Countries
            </Typography>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Country</TableCell>
                  {SERVICES.map((service) => (
                    <TableCell key={service.key} align="center">
                      {service.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {countries.map((country: any) => {
                  const countryName = country.countryShortName;

                  return (
                    <TableRow key={countryName}>
                      <TableCell>{countryName}</TableCell>

                      {SERVICES.map((service) => (
                        <TableCell key={service.key} align="center">
                          <Checkbox
                            checked={
                              serviceMapping[countryName]?.[service.key] ||
                              false
                            }
                            onChange={() =>
                              toggleService(countryName, service.key)
                            }
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Grid>
        )}

        {/* Document Upload */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: "flex", width: "100%" }}>
            <DocumentUpload country="" />
          </Box>
        </Grid>

        {/* Customer Reference & Comments */}
        <Grid size={{ xs: 12, md: 6 }}>
          <InputField
            label="Customer Reference"
            placeholder="Enter reference number"
          />

          <InputField
            label="Additional Comments"
            placeholder="Enter comments..."
            disabled={disabled}
            multiline
            minRows={5}
            sx={{
              marginTop: "15px",
              "& .MuiOutlinedInput-root": {
                alignItems: "flex-start",
              },
              "& textarea": {
                resize: "none",
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Alert severity="warning" sx={{ alignItems: "center" }}>
            Bulk ordering is not supported for the following countries:
            <Box component="span" sx={{ fontWeight: 600 }}>
              {" "}
              Algeria, Egypt, Iraq, Jordan, Kuwait, Lebanon, Nigeria, Qatar,
              Yemen, Taiwan, and Kurdistan.
            </Box>
          </Alert>
        </Grid>
      </Grid>
    </FormLayout>
  );
}
