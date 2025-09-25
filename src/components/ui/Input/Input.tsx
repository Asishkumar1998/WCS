// src/components/common/InputField.tsx
import React from "react";
import { TextField, TextFieldProps } from "@mui/material";

type InputFieldProps = TextFieldProps & {
  label: string;
  placeholder?: string;
  helperText?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  helperText,
  ...props
}) => {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      helperText={helperText}
      fullWidth
      variant="outlined"
      margin="none" // let Grid handle spacing consistently
      {...props} // ✅ now multiline, rows, type, etc. are supported
    />
  );
};

export default InputField;
