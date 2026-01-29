import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import ValidatedFileUpload from "./ValidatedFileUpload";
import DeleteIcon from "@mui/icons-material/Delete";

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
  fileName,
  onSelectFile,
}: {
  label: string;
  required?: boolean;
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

                  <IconButton size="small" onClick={removeFile}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>
        )}
      />
    </FormControl>
  );
};
