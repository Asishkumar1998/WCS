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
  error?: boolean;
  helperText?: string;
  style?: any;
  variant?: any;
  pinnedOptions?: string[];
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
  error = false,
  helperText = "",
  multiple = false,
  disabled = false,
  style = null,
  variant = "outlined",
  pinnedOptions = [],
}) => {
  const pinnedSet = new Set(pinnedOptions);

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
          const isPinned = pinnedSet.has(option);
          return multiple ? (
            <li key={key} {...rest}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
                disabled={disabled} // disable checkbox
              />
              <ListItemText
                primary={option}
                primaryTypographyProps={{
                  fontWeight: isPinned ? 700 : 400,
                }}
              />
            </li>
          ) : (
            <li
              key={key}
              {...rest}
              style={{ fontWeight: isPinned ? 700 : 400 }}
            >
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
            error={error}
            helperText={helperText}
            InputLabelProps={{
              ...params.InputLabelProps,
              sx: {
                "&.MuiInputLabel-shrink": {
                  px: 0.5,
                  borderRadius: 0.5,
                  backgroundColor: "background.paper",
                },
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
