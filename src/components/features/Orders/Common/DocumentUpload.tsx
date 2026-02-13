import {
  Autocomplete,
  Box,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import ValidatedFileUpload from "./ValidatedFileUpload";
import DeleteIcon from "@mui/icons-material/Delete";

const couriers = ["FEDEX", "UPS", "USPS", "DHL", "OTHERS"];

export default function DocumentUpload({
  country,
  onChange,
  forceOriginalMail = false,
}: {
  country?: any;
  onChange?: (data: any) => void;
  forceOriginalMail?: boolean;
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

  useEffect(() => {
    if (!forceOriginalMail) return;
    setNestedSelection("originalMailedNested");
    setUploadedFile(null);
    setFileName("");
    setNumPages("");
  }, [forceOriginalMail]);

  const handleFileChange = (file: File | null) => {
    setUploadedFile(file);
    setFileName(file?.name || "");
  };

  const removeFile = () => {
    setUploadedFile(null);
    setFileName("");
    setNestedSelection(null);
    setNumPages("");
    setTrackingNumberNested("");
    setCourierNested(null);
  };

  return (
    <FormControl
      fullWidth
      sx={{
        border: "1px solid #C7C9CD",
        borderRadius: 1,
      }}
      variant="outlined"
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
          px: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          width: "100%",
        }}
      >
        {/* File Upload */}
        <ValidatedFileUpload
          label="Choose file"
          fileNameProp={fileName}
          onChange={handleFileChange}
          disabled={forceOriginalMail}
        />
        {uploadedFile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 1,
              py: 0.5,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              fontSize: 12,
            }}
          >
            <Box>
              <Box fontWeight={500}>{uploadedFile.name}</Box>
              <Box fontSize={11} color="text.secondary">
                {(uploadedFile.size / 1024).toFixed(1)} KB
              </Box>
            </Box>

            <IconButton size="small" onClick={removeFile}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        {/* Nested Options */}
        <RadioGroup
          value={nestedSelection}
          onChange={(e) => {
            const value = e.target.value as any;
            if (forceOriginalMail && value === "proceedWithAttached") return;
            setNestedSelection(value);
          }}
        >
          {/* Attached */}
          <FormControlLabel
            value="proceedWithAttached"
            control={<Radio size="small" disabled={forceOriginalMail} />}
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
              inputProps={{ min: 0 }}
              onChange={(e) => setNumPages(e.target.value)}
              size="small"
              sx={{ width: { xs: "100%", sm: "90%" }, marginLeft: 3.5 }}
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
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                marginBottom: 2,
                marginLeft: 3.5,
              }}
            >
              <Box width={"100%"}>
                <TextField
                  label="Tracking number to WCS"
                  value={trackingNumberNested}
                  onChange={(e) => setTrackingNumberNested(e.target.value)}
                  size="small"
                  sx={{ flex: 1, width: "100%" }}
                />
              </Box>
              <Box width={"100%"}>
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
            </Box>
          )}
        </RadioGroup>
      </Box>
    </FormControl>
  );
}
