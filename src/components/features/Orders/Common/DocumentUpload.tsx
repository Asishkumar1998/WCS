import FileUploadField from "@/components/ui/Input/FileInput";
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
  const [nestedSelection, setNestedSelection] = useState<
    "proceedWithAttached" | "originalMailedNested" | null
  >(null);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState("");

  const [trackingNumberNested, setTrackingNumberNested] = useState("");
  const [courierNested, setCourierNested] = useState<string | null>(null);

  return (
    <Box
      sx={{
        border: "1px solid rgba(0,0,0,0.12)",
        borderRadius: "8px",
        p: 2.5,
        backgroundColor: "#fafbfc",
        width: "100%",
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 2, fontSize: "1.05rem", fontWeight: 600, color: "#333" }}
      >
        Upload Documents
      </Typography>

      {/* Upload Button */}
      <Box sx={{ mb: 2 }}>
        <FileUploadField label="Choose file" />
      </Box>

      {/* Nested Options */}
      <RadioGroup
        value={nestedSelection}
        onChange={(e) => setNestedSelection(e.target.value as any)}
      >
        {/* Proceed with Attached Documents */}
        <Box sx={{ mb: 1.5, display: "flex", flexDirection: "column" }}>
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
              sx={{ mt: 1, width: { xs: "100%", sm: "50%" } }}
            />
          )}
        </Box>

        {/* Original Mailed */}
        <Box>
          <FormControlLabel
            value="originalMailedNested"
            control={<Radio />}
            label={
              country?.countryShortName === "Vietnam"
                ? "Original document will be mailed to WCS office (after notarization & state certification)"
                : "Original document will be mailed to WCS office"
            }
          />
          {nestedSelection === "originalMailedNested" && (
            <Box
              sx={{
                mt: 1,
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                width: "100%",
              }}
            >
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
                onChange={(_, newValue) => setCourierNested(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Courier" size="small" />
                )}
                sx={{ flex: 1, minWidth: 160 }}
              />
            </Box>
          )}
        </Box>
      </RadioGroup>
    </Box>
  );
}
