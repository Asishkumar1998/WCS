import React from "react";
import { TextField, TextFieldProps } from "@mui/material";

type InputFieldProps = TextFieldProps & {
  label?: string;
  placeholder?: string;
  helperText?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  helperText,
  sx,
  ...props
}) => {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      helperText={helperText}
      fullWidth
      variant="outlined"
      margin="none"
      sx={[
        {
          "& .MuiInputLabel-root.MuiInputLabel-shrink": {
            px: 0.5,
            borderRadius: 0.5,
            backgroundColor: "background.paper",
          },
          "& .MuiFormLabel-asterisk": {
            color: "red",
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  );
};

export default InputField;
