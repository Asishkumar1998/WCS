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
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  style?: any;
  variant?: any;
}

interface SingleDropdownProps extends BaseDropdownProps {
  multiple?: false;
  value: string;
  onChange: (value: string) => void;
}

interface MultiDropdownProps extends BaseDropdownProps {
  multiple: true;
  value: number[];
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
  required = false,
  multiple = false,
  disabled = false,
  style = null,
  variant = "outlined"
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
        renderOption={(props, option, { selected }) => {
          const { key, ...rest } = props;
          return multiple ? (
            <li key={key} {...rest}>
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
            <li key={key} {...rest}>
              {option}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            variant="outlined"
            disabled={disabled}
            required={required}
            InputLabelProps={{
              ...params.InputLabelProps,
              sx: {
                "& .MuiFormLabel-asterisk": {
                  color: "red",
                },
              },
            }}
          />
        )}
        disableClearable={!multiple}
        disableCloseOnSelect={multiple}
        openOnFocus
        sx={style}
        ListboxProps={{ style: { maxHeight: 320 } }}
      />
    </FormControl>
  );
};

export default Dropdown;
