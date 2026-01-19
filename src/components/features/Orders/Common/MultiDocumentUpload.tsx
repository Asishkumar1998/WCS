"use client";

import {
  Autocomplete,
  Box,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useRef, useState } from "react";

const couriers = ["FEDEX", "UPS", "USPS", "DHL", "OTHERS"];

type NestedSelection =
  | "proceedWithAttached"
  | "originalMailedNested"
  | null;

export default function MultiDocumentUpload({
  country,
  onChange,
}: {
  country?: any;
  onChange?: (data: any) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [nestedSelection, setNestedSelection] =
    useState<NestedSelection>(null);
  const [numPages, setNumPages] = useState("");
  const [trackingNumberNested, setTrackingNumberNested] = useState("");
  const [courierNested, setCourierNested] = useState<string | null>(null);

  /* 🔁 Emit data to parent */
  useEffect(() => {
    onChange?.({
      uploadedFiles,
      nestedSelection,
      numPages,
      trackingNumberNested,
      courierNested,
    });
  }, [
    uploadedFiles,
    nestedSelection,
    numPages,
    trackingNumberNested,
    courierNested,
  ]);

  /* 📂 Handle file select */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);

    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  /* ❌ Remove file */
  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
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
    >
      <InputLabel shrink>Upload Documents *</InputLabel>

      <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Upload Button */}
        <Box>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            multiple
            onChange={handleFileSelect}
          />

          <Box
            onClick={() => fileInputRef.current?.click()}
            sx={{
              border: "1px dashed #999",
              borderRadius: 1,
              p: 2,
              cursor: "pointer",
              textAlign: "center",
              "&:hover": { bgcolor: "#f5f5f5" },
            }}
          >
            <Typography variant="body2" color="primary">
              Click to upload documents
            </Typography>
            <Typography variant="caption" color="text.secondary">
              You can upload multiple files
            </Typography>
          </Box>
        </Box>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <List dense>
            {uploadedFiles.map((file, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => removeFile(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={file.name}
                  secondary={`${(file.size / 1024).toFixed(1)} KB`}
                />
              </ListItem>
            ))}
          </List>
        )}

        {/* Nested Options */}
        <RadioGroup
          value={nestedSelection}
          onChange={(e) =>
            setNestedSelection(e.target.value as NestedSelection)
          }
        >
          <FormControlLabel
            value="proceedWithAttached"
            control={<Radio size="small" />}
            label="Process Attached Documents"
          />

          {nestedSelection === "proceedWithAttached" && (
            <TextField
              label="Total Number of Pages"
              type="number"
              value={numPages}
              onChange={(e) => setNumPages(e.target.value)}
              size="small"
              sx={{ width: { xs: "100%", sm: "60%" }, mt: 1 }}
            />
          )}

          <FormControlLabel
            value="originalMailedNested"
            control={<Radio size="small" />}
            label={
              country?.countryShortName === "Vietnam"
                ? "Mail Original Documents to WCS office (after notarization & state certification)"
                : "Mail Original Documents to WCS office"
            }
          />

          {nestedSelection === "originalMailedNested" && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
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
