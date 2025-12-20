"use client";

import * as React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface DateInputProps {
  label: string;
  value?: any;
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
            fullWidth: true,
            variant: "outlined",
            margin: "none", // ✅ matches your InputField
            sx: {
              "& .MuiInputBase-root": {
                height: "56px", // ✅ same height as TextField/Dropdown
              },
            },
          } as any,
        }}
      />
    </LocalizationProvider>
  );
};

export default DateInput;
