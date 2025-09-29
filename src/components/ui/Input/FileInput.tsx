import React, { useState } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  Box,
  Typography,
} from "@mui/material";

interface FileUploadFieldProps {
  label: string;
  onChange?: (file: File | null) => void;
}

export default function FileUploadField({
  label,
  onChange,
}: FileUploadFieldProps) {
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File | null) => {
    setFileName(file ? file.name : "");
    onChange?.(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files?.[0] || null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <Box
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      sx={{
        border: "2px dashed",
        borderColor: isDragging ? "primary.main" : "grey.400",
        borderRadius: 2,
        p: 2,
        transition: "0.2s",
        backgroundColor: isDragging ? "action.hover" : "transparent",
      }}
    >
      <TextField
        label={label}
        fullWidth
        variant="outlined"
        margin="none"
        value={fileName}
        placeholder="Drag & drop a file here or choose manually"
        InputProps={{
          readOnly: true,
          sx: { cursor: "default" },
          endAdornment: (
            <InputAdornment position="end">
              <Button
                variant="contained"
                component="label"
                size="small"
                sx={{ textTransform: "none" }}
              >
                Choose File
                <input type="file" hidden onChange={handleInputChange} />
              </Button>
            </InputAdornment>
          ),
        }}
      />

      {!fileName && (
        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 1, color: "text.secondary" }}
        >
          or drag & drop your file here
        </Typography>
      )}
    </Box>
  );
}
