import React, { useState } from "react";
import { TextField, Button, InputAdornment } from "@mui/material";

interface FileUploadFieldProps {
  label: string;
  onChange?: (file: File | null) => void;
}

export default function FileUploadField({
  label,
  onChange,
}: FileUploadFieldProps) {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileName(file ? file.name : "");
    onChange?.(file);
  };

  return (
    <TextField
      label={label}
      fullWidth
      variant="outlined"
      margin="none"
      value={fileName}
      placeholder="No file chosen"
      InputProps={{
        readOnly: true, // user cannot type
        sx: { cursor: "default" }, // no text cursor
        endAdornment: (
          <InputAdornment position="end">
            <Button
              variant="contained"
              component="label"
              size="small"
              sx={{ textTransform: "none" }}
            >
              Choose File
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </InputAdornment>
        ),
      }}
    />
  );
}
