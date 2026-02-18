"use client";

import {
  Autocomplete,
  Alert,
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
const ALLOWED_TYPES = ["pdf", "doc", "docx"];
const MAX_SIZE_MB = 5;

type NestedSelection = "proceedWithAttached" | "originalMailedNested" | null;

type UploadValue = {
  uploadedFiles: File[];
  nestedSelection: NestedSelection;
  numPages: string;
  trackingNumberNested: string;
  courierNested: string | null;
};

type Props = {
  country?: any;
  onChange?: (data: UploadValue) => void;
  value?: Partial<UploadValue>;
};

const defaultValue = (): UploadValue => ({
  uploadedFiles: [],
  nestedSelection: null,
  numPages: "",
  trackingNumberNested: "",
  courierNested: null,
});

export default function MultiDocumentUpload({ country, onChange, value }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isControlled = value !== undefined;

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [nestedSelection, setNestedSelection] = useState<NestedSelection>(null);
  const [numPages, setNumPages] = useState("");
  const [trackingNumberNested, setTrackingNumberNested] = useState("");
  const [courierNested, setCourierNested] = useState<string | null>(null);
  const [error, setError] = useState("");

  const current: UploadValue = isControlled
    ? {
        uploadedFiles: value?.uploadedFiles ?? [],
        nestedSelection: value?.nestedSelection ?? null,
        numPages: value?.numPages ?? "",
        trackingNumberNested: value?.trackingNumberNested ?? "",
        courierNested: value?.courierNested ?? null,
      }
    : {
        uploadedFiles,
        nestedSelection,
        numPages,
        trackingNumberNested,
        courierNested,
      };

  const apply = (next: UploadValue) => {
    if (isControlled) {
      onChange?.(next);
      return;
    }

    setUploadedFiles(next.uploadedFiles);
    setNestedSelection(next.nestedSelection);
    setNumPages(next.numPages);
    setTrackingNumberNested(next.trackingNumberNested);
    setCourierNested(next.courierNested);
  };

  useEffect(() => {
    if (isControlled) return;
    onChange?.({
      uploadedFiles,
      nestedSelection,
      numPages,
      trackingNumberNested,
      courierNested,
    });
  }, [
    isControlled,
    onChange,
    uploadedFiles,
    nestedSelection,
    numPages,
    trackingNumberNested,
    courierNested,
  ]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const validFiles: File[] = [];
    const invalidReasons: string[] = [];

    files.forEach((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      const isValidType = ALLOWED_TYPES.includes(ext);
      const isValidSize = file.size / 1024 / 1024 <= MAX_SIZE_MB;

      if (!isValidType) {
        invalidReasons.push(
          `${file.name}: invalid type (allowed ${ALLOWED_TYPES
            .map((t) => t.toUpperCase())
            .join(", ")})`,
        );
        return;
      }

      if (!isValidSize) {
        invalidReasons.push(
          `${file.name}: file too large (max ${MAX_SIZE_MB} MB)`,
        );
        return;
      }

      validFiles.push(file);
    });

    if (invalidReasons.length > 0) {
      setError(invalidReasons.join(" | "));
    } else {
      setError("");
    }

    if (validFiles.length === 0) {
      e.target.value = "";
      return;
    }

    apply({
      ...current,
      uploadedFiles: [...current.uploadedFiles, ...validFiles],
    });
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    apply({
      ...current,
      uploadedFiles: current.uploadedFiles.filter((_, i) => i !== index),
    });
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
        <Box>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            multiple
            onChange={handleFileSelect}
            accept={ALLOWED_TYPES.map((t) => `.${t}`).join(",")}
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

        {current.uploadedFiles.length > 0 && (
          <List dense>
            {current.uploadedFiles.map((file, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton edge="end" onClick={() => removeFile(index)}>
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

        {error && <Alert severity="error">{error}</Alert>}

        <RadioGroup
          value={current.nestedSelection}
          onChange={(e) =>
            apply({
              ...current,
              nestedSelection: e.target.value as NestedSelection,
            })
          }
        >
          <FormControlLabel
            value="proceedWithAttached"
            control={<Radio size="small" />}
            label="Process Attached Documents"
          />

          {current.nestedSelection === "proceedWithAttached" && (
            <TextField
              label="Total Number of Pages"
              type="number"
              value={current.numPages}
              onChange={(e) =>
                apply({
                  ...current,
                  numPages: e.target.value,
                })
              }
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

          {current.nestedSelection === "originalMailedNested" && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
              <TextField
                label="Tracking number to WCS"
                value={current.trackingNumberNested}
                onChange={(e) =>
                  apply({
                    ...current,
                    trackingNumberNested: e.target.value,
                  })
                }
                size="small"
                sx={{ flex: 1 }}
              />

              <Autocomplete
                options={couriers}
                value={current.courierNested}
                onChange={(_, nextCourier) =>
                  apply({
                    ...current,
                    courierNested: nextCourier,
                  })
                }
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
