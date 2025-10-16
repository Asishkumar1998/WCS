import React from "react";
import {
  Autocomplete,
  TextField,
  FormControl,
  Checkbox,
  ListItemText,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

interface BaseDropdownProps {
  label: string;
  options: string[];
  multiple?: boolean; // ✅ choose single or multiple
  disabled?: boolean; // ✅ new prop
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

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChange,
  multiple = false,
  disabled = false, // default false
}) => {
  return (
    <FormControl fullWidth>
      <Autocomplete
        multiple={multiple}
        options={options}
        value={value as any}
        onChange={(_, newValue) =>
          multiple
            ? (onChange as (v: string[]) => void)(newValue as string[])
            : (onChange as (v: string) => void)(newValue as string)
        }
        disabled={disabled} // disable the input
        renderOption={(props, option, { selected }) =>
          multiple ? (
            <li {...props}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
                disabled={disabled} // disable checkbox
              />
              <ListItemText primary={option} />
            </li>
          ) : (
            <li {...props}>{option}</li>
          )
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            variant="outlined"
            disabled={disabled}
          />
        )}
        disableClearable={!multiple}
        disableCloseOnSelect={multiple}
        openOnFocus
        ListboxProps={{ style: { maxHeight: 320 } }}
      />
    </FormControl>
  );
};

export default Dropdown;
