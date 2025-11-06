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
import { useState } from "react";
import ValidatedFileUpload from "./ValidatedFileUpload";

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
    <Grid size={{ xs: 12, md: 12 }}>
      <FormControl
        fullWidth
        variant="outlined"
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              border: "1px solid #C7C9CD", // static border
            },
            "&:hover fieldset": {
              border: "1px solid #C7C9CD", // prevent hover highlight
            },
            "&.Mui-focused fieldset": {
              border: "1px solid #C7C9CD", // prevent focus border color change
            },
          },
        }}
      >
        <InputLabel shrink>Upload Documents</InputLabel>
        <OutlinedInput
          notched
          label="Upload Documents"
          inputComponent={() => (
            <Box
              sx={{
                px: 2,
                py: 1.5,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                borderRadius: "8px",
                width: "100%",
              }}
            >
              {/* Upload Button */}
              <Box sx={{ mb: 1 }}>
                <ValidatedFileUpload label="Choose file" />
              </Box>

              {/* Nested Options */}
              <RadioGroup
                value={nestedSelection}
                onChange={(e) => setNestedSelection(e.target.value as any)}
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: { xs: "0.85rem", sm: "0.9rem" },
                    // whiteSpace: "nowrap",
                  },
                  "& .MuiFormControlLabel-root": {
                    marginLeft: "0.2px",
                  },
                }}
              >
                {/* Proceed with Attached Documents */}
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <FormControlLabel
                    value="proceedWithAttached"
                    control={
                      <Radio
                        size="small"
                        sx={{
                          p: 0.5,
                          "& .MuiSvgIcon-root": { fontSize: 18 },
                        }}
                      />
                    }
                    label="Proceed with attached documents"
                  />
                  {nestedSelection === "proceedWithAttached" && (
                    <TextField
                      label="Number of pages"
                      type="number"
                      value={numPages}
                      onChange={(e) => setNumPages(e.target.value)}
                      size="small"
                      sx={{ width: { xs: "100%", sm: "50%" } }}
                    />
                  )}
                </Box>

                {/* Original Mailed */}
                <Box>
                  <FormControlLabel
                    value="originalMailedNested"
                    control={
                      <Radio
                        size="small"
                        sx={{
                          p: 0.5,
                          "& .MuiSvgIcon-root": { fontSize: 18 },
                        }}
                      />
                    }
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
                        sx={{ flex: 1, minWidth: 160 }}
                      />
                    </Box>
                  )}
                </Box>
              </RadioGroup>
            </Box>
          )}
        />
      </FormControl>
    </Grid>
  );
}
