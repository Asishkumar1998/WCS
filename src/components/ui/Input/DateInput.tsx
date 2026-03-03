"use client";

import * as React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface DateInputProps {
  label: string;
  value?: any;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  onChange?: (date: any) => void;
  disablePast?: boolean;
  disableFuture?: boolean;
  minDate?: any;
  maxDate?: any;
  disabled?: boolean;
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  required = false,
  error = false,
  helperText = "",
  onChange,
  disablePast = false,
  disableFuture = false,
  minDate,
  maxDate,
  disabled,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        disablePast={disablePast}
        disableFuture={disableFuture}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        slotProps={{
          textField: {
            required,
            error,
            helperText,
            fullWidth: true,
            variant: "outlined",
            margin: "none",
            sx: {
              "& .MuiInputBase-root": {
                height: "56px",
              },
              "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                px: 0.5,
                borderRadius: 0.5,
                backgroundColor: "background.paper",
              },
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            },
          } as any,
        }}
      />
    </LocalizationProvider>
  );
};

export default DateInput;
