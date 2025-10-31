"use client";
import React, { useState } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  Box,
  Typography,
  Alert,
  Stack,
  Link,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

interface FileUploadFieldProps {
  label: string;
  onChange?: (file: File | null) => void;
  disabled?: boolean;
  allowedTypes?: string[];
  maxSizeMB?: number;
}

export default function ValidatedFileUpload({
  label,
  onChange,
  disabled = false,
  allowedTypes = ["pdf", "doc", "docx"],
  maxSizeMB = 5,
}: FileUploadFieldProps) {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const validateFile = (file: File): boolean => {
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
    const isValidType = allowedTypes.includes(fileExt);
    const isValidSize = file.size / 1024 / 1024 <= maxSizeMB;

    if (!isValidType) {
      setError(
        `Invalid file type. Only ${allowedTypes
          .map((t) => t.toUpperCase())
          .join(", ")} files are allowed.`
      );
      return false;
    }

    if (!isValidSize) {
      setError(
        `File is too large (max ${maxSizeMB} MB). Please contact WCS team for assistance.`
      );
      return false;
    }

    return true;
  };

  const handleFileChange = (file: File | null) => {
    setError("");
    setInfoMsg("");

    if (!file) {
      setFileName("");
      onChange?.(null);
      return;
    }

    if (!validateFile(file)) {
      setFileName("");
      onChange?.(null);
      return;
    }

    setFileName(file.name);
    onChange?.(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    if (files.length > 1) {
      setInfoMsg(
        "You selected multiple files. Please use the Bulk Ordering feature for faster processing."
      );
      handleFileChange(files[0]);
    } else {
      handleFileChange(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (!files?.length) return;

    if (files.length > 1) {
      setInfoMsg(
        "You dropped multiple files. Please use the Bulk Ordering feature."
      );
      handleFileChange(files[0]);
    } else {
      handleFileChange(files[0]);
    }
  };

  return (
    <Box
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      sx={{
        border: "2px dashed",
        borderColor: error ? "error.main" : "grey.400",
        borderRadius: 2,
        p: 2,
        transition: "0.3s",
        backgroundColor: "background.paper",
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      <Stack spacing={1.2}>
        <TextField
          label={label}
          fullWidth
          variant="outlined"
          value={fileName}
          placeholder="Drag & drop your file here or choose manually"
          InputProps={{
            readOnly: true,
            sx: { cursor: "default", fontWeight: fileName ? 600 : 400 },
            endAdornment: (
              <InputAdornment position="end" sx={{ ml: 1, flexShrink: 0 }}>
                <Button
                  variant="contained"
                  component="label"
                  size="small"
                  sx={{
                    textTransform: "none",
                    whiteSpace: "nowrap", // ✅ keeps button text on one line
                    fontSize: "0.75rem", // ✅ smaller font for mobile
                    px: { xs: 1, sm: 1.5 },
                    py: { xs: 0.5, sm: 0.6 },
                  }}
                  disabled={disabled}
                >
                  Choose File
                  <input
                    type="file"
                    hidden
                    onChange={handleInputChange}
                    accept={allowedTypes.map((t) => `.${t}`).join(",")}
                  />
                </Button>
              </InputAdornment>
            ),
          }}
          error={!!error}
        />

        {/* Alerts */}
        {error && (
          <Alert
            severity="error"
            icon={<WarningAmberOutlinedIcon fontSize="small" />}
          >
            {error}
          </Alert>
        )}

        {infoMsg && (
          <Alert severity="info" icon={<InfoOutlinedIcon fontSize="small" />}>
            {infoMsg}
          </Alert>
        )}

        {/* ✅ Persistent Info Section */}
        {!error && (
          <Box textAlign="center">
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
            >
              Allowed: {allowedTypes.map((t) => t.toUpperCase()).join(", ")} |
              Max size: {maxSizeMB} MB
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "primary.main", display: "block" }}
            >
              Have more than one file?{" "}
              <Link
                variant="caption"
                href="/orders/bulk-ordering"
                sx={{
                  fontWeight: 600,
                  textDecoration: "underline",
                  color: "primary.main",
                }}
              >
                Use Bulk Ordering
              </Link>
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
