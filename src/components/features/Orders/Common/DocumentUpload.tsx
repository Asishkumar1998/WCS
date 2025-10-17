import {
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

const couriers = ["FEDEX", "UPS", "USPS", "DHL", "OTHERS"];

export default function DocumentUpload({ country }: { country: any }) {
  const [topSelection, setTopSelection] = useState<
    "uploadOrDrag" | "originalMailedTop" | null
  >(null);
  const [nestedSelection, setNestedSelection] = useState<
    "proceedWithAttached" | "originalMailedNested" | null
  >(null);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState("");

  const [trackingNumberNested, setTrackingNumberNested] = useState("");
  const [courierNested, setCourierNested] = useState<string | null>(null);

  const [trackingNumberTop, setTrackingNumberTop] = useState("");
  const [courierTop, setCourierTop] = useState<string | null>(null);

  return (
    <>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Upload Documents
      </Typography>

      <RadioGroup
        value={topSelection}
        onChange={(e) => {
          setTopSelection(e.target.value as any);
          setNestedSelection(null); // reset nested
        }}
      >
        {/* Parent: Upload or drag */}
        <Box sx={{ mb: 1 }}>
          <FormControlLabel
            value="uploadOrDrag"
            control={<Radio />}
            label={
              country?.countryShortName == "Vietnam"
                ? "Upload un-notarized document (document will be notarized by WCS and certified by MD Secretary of State)"
                : "Upload or drag & drop your documents"
            }
          />

          {topSelection === "uploadOrDrag" && (
            <Box
              sx={{ pl: 4, display: "flex", flexDirection: "column", gap: 1 }}
            >
              {/* File Upload */}
              <Button variant="outlined" component="label">
                {uploadedFile ? uploadedFile.name : "Choose File"}
                <input
                  type="file"
                  hidden
                  onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                />
              </Button>

              {/* Nested Radios */}
              <RadioGroup
                value={nestedSelection}
                onChange={(e) => setNestedSelection(e.target.value as any)}
              >
                <Box sx={{ mb: 1 }}>
                  <FormControlLabel
                    value="proceedWithAttached"
                    control={<Radio />}
                    label="Proceed with attached documents"
                  />
                  {nestedSelection === "proceedWithAttached" && (
                    <TextField
                      label="Number of pages"
                      type="number"
                      value={numPages}
                      onChange={(e) => setNumPages(e.target.value)}
                      size="small"
                      sx={{ width: "50%" }}
                    />
                  )}
                </Box>

                <Box sx={{ mb: 1 }}>
                  <FormControlLabel
                    value="originalMailedNested"
                    control={<Radio />}
                    label={"Original document will be mailed to WCS office"}
                  />
                  {nestedSelection === "originalMailedNested" && (
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <TextField
                        label="Tracking number to WCS"
                        value={trackingNumberNested}
                        onChange={(e) =>
                          setTrackingNumberNested(e.target.value)
                        }
                        size="small"
                        sx={{ flex: 1 }}
                      />
                      <Autocomplete
                        options={couriers}
                        value={courierNested}
                        onChange={(_, newValue) => setCourierNested(newValue)}
                        renderInput={(params) => (
                          <TextField {...params} label="Courier" size="small" />
                        )}
                        sx={{ flex: 1 }}
                      />
                    </Box>
                  )}
                </Box>
              </RadioGroup>
            </Box>
          )}
        </Box>

        {/* Parent: Original mailed top-level */}
        <Box>
          <FormControlLabel
            value="originalMailedTop"
            control={<Radio />}
            label={
              country?.countryShortName == "Vietnam"
                ? "Please mail original, notarized document (document will be certified by local Secretary of State where document is notarized)"
                : "Original document will be mailed to WCS office"
            }
          />
          {topSelection === "originalMailedTop" && (
            <Box sx={{ pl: 4, display: "flex", gap: 1, flexWrap: "wrap" }}>
              <TextField
                label="Tracking number to WCS"
                value={trackingNumberTop}
                onChange={(e) => setTrackingNumberTop(e.target.value)}
                size="small"
                sx={{ flex: 1 }}
              />
              <Autocomplete
                options={couriers}
                value={courierTop}
                onChange={(_, newValue) => setCourierTop(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Courier" size="small" />
                )}
                sx={{ flex: 1 }}
              />
            </Box>
          )}
        </Box>
      </RadioGroup>
    </>
  );
}
