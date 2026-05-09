import { Button, IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

const OneLineUpload = ({
  onFileSelect,
  clearFile,
  onRemoveFile,
}: {
  onFileSelect: (file: File) => void;
  clearFile?: boolean;
  onRemoveFile?: (index: number) => void;
}) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);

  useEffect(() => {
    if (clearFile) {
      setFileNames([]);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }, [clearFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileNames((prev) => [...prev, file.name]);
    onFileSelect(file);
  };

  const handleRemove = (index: number) => {
    setFileNames((prev) => prev.filter((_, i) => i !== index));

    onRemoveFile?.(index);
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <input ref={inputRef} type="file" hidden onChange={handleChange} />

      <Button
        size="small"
        variant="outlined"
        onClick={() => inputRef.current?.click()}
        sx={{ textTransform: "none", whiteSpace: "nowrap" }}
      >
        Upload document
      </Button>

      {/* {fileNames.map((name, index) => (
        <Stack
          key={index}
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={{
            border: "1px solid #d1d5db",
            borderRadius: "16px",
            px: 1,
            py: 0.3,
            backgroundColor: "#f5f5f5",
            maxWidth: 220,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 160,
              color: "text.secondary",
            }}
          >
            {name}
          </Typography>

          <IconButton
            size="small"
            onClick={() => handleRemove(index)}
            sx={{ padding: "2px" }}
          >
            <CloseIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Stack>
        
      ))} */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          overflowX: "auto",
          maxWidth: "490px",
          scrollbarWidth: "thin",
        }}
      >
        {fileNames.map((name, index) => (
          <Stack
            key={index}
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{
              border: "1px solid #d1d5db",
              borderRadius: "16px",
              px: 1,
              py: 0.3,
              backgroundColor: "#f5f5f5",
              minWidth: "fit-content",
              flexShrink: 0,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                whiteSpace: "nowrap",
                color: "text.secondary",
              }}
            >
              {name}
            </Typography>

            <IconButton
              size="small"
              onClick={() => handleRemove(index)}
              sx={{ padding: "2px" }}
            >
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default OneLineUpload;