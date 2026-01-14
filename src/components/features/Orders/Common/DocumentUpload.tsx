import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import ValidatedFileUpload from "./ValidatedFileUpload";

const couriers = ["FEDEX", "UPS", "USPS", "DHL", "OTHERS"];

export default function DocumentUpload({
  country,
  onChange,
}: {
  country: any;
  onChange?: (data: any) => void;
}) {
  const [nestedSelection, setNestedSelection] = useState<
    "proceedWithAttached" | "originalMailedNested" | null
  >(null);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState("");
  const [trackingNumberNested, setTrackingNumberNested] = useState("");
  const [courierNested, setCourierNested] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    onChange?.({
      uploadedFile,
      nestedSelection,
      numPages,
      trackingNumberNested,
      courierNested,
    });
  }, [
    uploadedFile,
    nestedSelection,
    numPages,
    trackingNumberNested,
    courierNested,
  ]);

  const handleFileChange = (file: File | null) => {
    setUploadedFile(file);
    setFileName(file?.name || "");
  };

  return (
    <FormControl
      fullWidth
      sx={{
        border: "1px solid #C7C9CD",
        borderRadius: 1,
        px: 2,
        py: 1.5,
      }}
      required
    >
      <InputLabel
        shrink
        sx={{
          "& .MuiFormLabel-asterisk": {
            color: "red",
          },
        }}
      >
        Upload Document
      </InputLabel>

      <Box
        sx={{
          mt: 3,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {/* File Upload */}
        <ValidatedFileUpload
          label="Choose file"
          fileNameProp={fileName}
          onChange={handleFileChange}
        />

        {/* Nested Options */}
        <RadioGroup
          value={nestedSelection}
          onChange={(e) => setNestedSelection(e.target.value as any)}
        >
          {/* Attached */}
          <FormControlLabel
            value="proceedWithAttached"
            control={<Radio size="small" />}
            label={
              country?.countryId === 195
                ? "Upload un-notarized document (document will be notarized by WCS and certified by MD Secretary of State)"
                : "Process Attached Documents"
            }
          />

          {nestedSelection === "proceedWithAttached" && (
            <TextField
              label="Add Number of Pages"
              type="number"
              value={numPages}
              onChange={(e) => setNumPages(e.target.value)}
              size="small"
              sx={{ width: { xs: "100%", sm: "60%" } }}
            />
          )}

          {/* Original Mailed */}
          <FormControlLabel
            value="originalMailedNested"
            control={<Radio size="small" />}
            label={
              country?.countryId === 195
                ? "Mail Original Documents to WCS office (after notarization & state certification)"
                : "Mail Original Documents to WCS office"
            }
          />

          {nestedSelection === "originalMailedNested" && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <TextField
                label="Tracking number to WCS"
                value={trackingNumberNested}
                onChange={(e) => setTrackingNumberNested(e.target.value)}
                size="small"
                sx={{ flex: 1 }}
              />

              <Autocomplete
                options={couriers}
                value={courierNested}
                onChange={(_, value) => setCourierNested(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Courier" size="small" />
                )}
                sx={{ flex: 1, minWidth: 160 }}
              />
            </Box>
          )}
        </RadioGroup>
      </Box>
    </FormControl>
  );
}
