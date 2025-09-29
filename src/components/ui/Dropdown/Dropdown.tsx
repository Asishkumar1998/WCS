import React from "react";
import { Autocomplete, TextField, FormControl } from "@mui/material";

interface DropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChange,
}) => {
  return (
    <FormControl fullWidth>
      <Autocomplete
        options={options}
        value={value}
        onChange={(_, newValue) => onChange(newValue || "")}
        renderInput={(params) => (
          <TextField {...params} label={label} variant="outlined" />
        )}
        disableClearable // removes the "x" button (optional)
        openOnFocus // opens dropdown when focused
        ListboxProps={{ style: { maxHeight: 320 } }}
      />
    </FormControl>
  );
};

export default Dropdown;
