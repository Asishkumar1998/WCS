import { Button, Stack, Typography } from "@mui/material";
import React, { useState } from "react";

const OneLineUpload = ({ onFileSelect }: { onFileSelect: (file: File) => void }) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    onFileSelect(file);
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={handleChange}
      />

      <Button
        size="small"
        variant="outlined"
        onClick={() => inputRef.current?.click()}
        sx={{ textTransform: "none", whiteSpace: "nowrap" }}
      >
        Upload document
      </Button>

      {fileName && (
        <Typography
          variant="caption"
          sx={{
            maxWidth: 160,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: "text.secondary",
          }}
        >
          {fileName}
        </Typography>
      )}
    </Stack>
  );
};

export default OneLineUpload;