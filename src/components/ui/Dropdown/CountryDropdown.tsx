"use client";
import React from "react";
import {
  Autocomplete,
  TextField,
  Avatar,
  Box,
  FormControl,
  ListItemText,
  Checkbox,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { countries } from "@/dataset/countries";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface Country {
  code: string;
  label: string;
}

interface BaseProps {
  label?: string;
  multiple?: boolean;
  fullWidth?: boolean;
}

interface SingleSelectProps extends BaseProps {
  multiple?: false;
  value: Country | null;
  onChange: (value: Country | null) => void;
}

interface MultiSelectProps extends BaseProps {
  multiple: true;
  value: Country[];
  onChange: (value: Country[]) => void;
}

type CountrySelectProps = SingleSelectProps | MultiSelectProps;

const CountrySelect: React.FC<CountrySelectProps> = ({
  label = "Select Country",
  multiple = false,
  value,
  onChange,
  fullWidth = true,
}) => {
  return (
    <FormControl fullWidth={fullWidth}>
      <Autocomplete
        multiple={multiple}
        options={countries}
        getOptionLabel={(option) => option.label}
        value={value as any}
        onChange={(_, newValue) =>
          multiple
            ? (onChange as (v: Country[]) => void)(newValue as Country[])
            : (onChange as (v: Country | null) => void)(
                newValue as Country | null
              )
        }
        // ✅ Enables searching by both label and code
        filterOptions={(options, { inputValue }) =>
          options.filter(
            (option) =>
              option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
              option.code.toLowerCase().includes(inputValue.toLowerCase())
          )
        }
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Box display="flex" alignItems="center" gap={1}>
              {multiple && (
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
              )}
              <Avatar
                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                alt={option.label}
                sx={{ width: 24, height: 18 }}
                variant="square"
              />
              <ListItemText
                primary={option.label}
                secondary={option.code}
                secondaryTypographyProps={{
                  sx: { color: "text.secondary", fontSize: "0.75rem" },
                }}
              />
            </Box>
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} label={label} variant="outlined" />
        )}
        disableCloseOnSelect={multiple}
        openOnFocus
        ListboxProps={{ style: { maxHeight: 320 } }}
      />
    </FormControl>
  );
};

export default CountrySelect;
