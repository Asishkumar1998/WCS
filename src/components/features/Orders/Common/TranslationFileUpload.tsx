import { Box, FormControl, InputLabel, OutlinedInput } from "@mui/material";
import ValidatedFileUpload from "./ValidatedFileUpload";
import { useState } from "react";

const staticBorderSx = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "1px solid #C7C9CD",
    },
    "&:hover fieldset": {
      border: "1px solid #C7C9CD",
    },
    "&.Mui-focused fieldset": {
      border: "1px solid #C7C9CD",
    },
  },
};

export const FileUploadBox = ({
  label,
  required = false,
  onSelectFile,
}: {
  label: string;
  required?: boolean;
  onSelectFile?: (file: File | null) => void;
}) => {
  const [fileName, setFileName] = useState("");
  const handleSelectFile = (file: File | null) => {
    setFileName(file?.name || "");
    onSelectFile?.(file);
  };
  return (
    <FormControl
      fullWidth
      variant="outlined"
      sx={staticBorderSx}
      required={required}
    >
      <InputLabel
        shrink
        sx={{
          "& .MuiFormLabel-asterisk": {
            color: "red",
          },
        }}
      >
        {label}
      </InputLabel>

      <OutlinedInput
        notched
        label={label}
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
            <Box sx={{ mb: 1 }}>
              <ValidatedFileUpload
                label="Upload File"
                fileNameProp={fileName}
                onChange={handleSelectFile}
              />
            </Box>
          </Box>
        )}
      />
    </FormControl>
  );
};
