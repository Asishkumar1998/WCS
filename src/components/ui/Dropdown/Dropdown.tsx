import React from "react";
import { Autocomplete, TextField, FormControl } from "@mui/material";

interface BaseDropdownProps {
  label: string;
  options: string[];
  multiple?: boolean; // ✅ choose single or multiple
}

interface SingleDropdownProps extends BaseDropdownProps {
  multiple?: false;
  value: string;
  onChange: (value: string) => void;
}

interface MultiDropdownProps extends BaseDropdownProps {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
}

type DropdownProps = SingleDropdownProps | MultiDropdownProps;

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChange,
  multiple = false,
}) => {
  return (
    <FormControl fullWidth>
      <Autocomplete
        multiple={multiple}
        options={options}
        value={value as any} // TS needs coercion here
        onChange={(_, newValue) =>
          multiple
            ? (onChange as (v: string[]) => void)(newValue as string[])
            : (onChange as (v: string) => void)(newValue as string)
        }
        renderInput={(params) => (
          <TextField {...params} label={label} variant="outlined" />
        )}
        disableClearable={!multiple} // in single mode, remove "x" button
        disableCloseOnSelect={multiple} // keep menu open for multiple
        openOnFocus
        ListboxProps={{ style: { maxHeight: 320 } }}
      />
    </FormControl>
  );
};

export default Dropdown;
