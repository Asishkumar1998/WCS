import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import ValidatedFileUpload from "./ValidatedFileUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";

const getBorderSx = (error: boolean) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "1px solid",
      borderColor: error ? "#d32f2f" : "#C7C9CD",
    },
    "&:hover fieldset": {
      border: "1px solid",
      borderColor: error ? "#d32f2f" : "#C7C9CD",
    },
    "&.Mui-focused fieldset": {
      border: "1px solid",
      borderColor: error ? "#d32f2f" : "#C7C9CD",
    },
  },
});

const UploadInputContent = ({
  fileName,
  onSelectFile,
  onRemoveFile,
}: {
  fileName?: string;
  onSelectFile?: (file: File | null) => void;
  onRemoveFile?: () => void;
}) => (
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
        onChange={onSelectFile}
      />
      {fileName && (
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
            mt: 1,
          }}
        >
          <Box>
            <Box fontWeight={500}>{fileName}</Box>
          </Box>

          <IconButton size="small" onClick={onRemoveFile}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  </Box>
);

const UploadInputComponent = React.forwardRef<
  HTMLDivElement,
  {
    fileName?: string;
    onSelectFile?: (file: File | null) => void;
    onRemoveFile?: () => void;
  }
>(({ fileName, onSelectFile, onRemoveFile }, _ref) => (
  <UploadInputContent
    fileName={fileName}
    onSelectFile={onSelectFile}
    onRemoveFile={onRemoveFile}
  />
));
UploadInputComponent.displayName = "UploadInputComponent";

export const FileUploadBox = ({
  label,
  required = false,
  error = false,
  helperText = "",
  fileName,
  onSelectFile,
}: {
  label: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  fileName?: string
  onSelectFile?: (file: File | null) => void;
}) => {
  const handleSelectFile = (file: File | null) => {
    onSelectFile?.(file);
  };
  const removeFile = () => {
    onSelectFile?.(null);
  };

  return (
    <FormControl
      fullWidth
      variant="outlined"
      sx={getBorderSx(error)}
      required={required}
      error={error}
    >
      <InputLabel
        shrink
        sx={{
          px: 0.5,
          borderRadius: 0.5,
          backgroundColor: "background.paper",
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
        error={error}
        inputComponent={UploadInputComponent as any}
        inputProps={{
          fileName,
          onSelectFile: handleSelectFile,
          onRemoveFile: removeFile,
        }}
      />
      {error && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
