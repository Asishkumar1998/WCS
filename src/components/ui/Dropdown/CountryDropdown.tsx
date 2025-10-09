"use client";
import React from "react";
import {
  Autocomplete,
  TextField,
  Avatar,
  Box,
  FormControl,
  Checkbox,
} from "@mui/material";
import { countries } from "@/dataset/countries";

interface Country {
  code: string;
  label: string;
}

interface CountrySelectProps {
  label?: string; // dropdown label
  multiple?: boolean;
  fullWidth?: boolean;
  value: Country | Country[] | null;
  onChange: (value: Country | Country[] | null) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  label = "Select country",
  multiple = false,
  fullWidth = true,
  value = null,
  onChange,
}) => {
  return (
    <FormControl fullWidth={fullWidth}>
      <Autocomplete
        multiple={multiple}
        options={countries}
        getOptionLabel={(option) => option.label}
        value={value as any}
        onChange={(_, newValue) => onChange(newValue as any)}
        disableCloseOnSelect={multiple}
        disableClearable={!multiple}
        openOnFocus
        ListboxProps={{ style: { maxHeight: 320 } }}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: "100%",
                px: 1.25,
                py: 0.75,
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                "&:last-of-type": { borderBottom: "none" },
                "&:hover": { backgroundColor: "#f7f7fb" },
              }}
            >
              {multiple && (
                <Checkbox
                  checked={selected}
                  size="small"
                  sx={{ ml: -0.5 }}
                  tabIndex={-1}
                />
              )}
              <Avatar
                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                alt={option.label}
                sx={{ width: 24, height: 18, borderRadius: "3px" }}
                variant="square"
              />
              <Box component="span" sx={{ ml: 0.5, fontSize: "0.95rem" }}>
                {option.label}
              </Box>
            </Box>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label} // ✅ same as normal dropdown
            variant="outlined" // ✅ same as normal dropdown
          />
        )}
      />
    </FormControl>
  );
};

export default CountrySelect;
