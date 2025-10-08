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
  label?: string; // placeholder text
  multiple?: boolean;
  fullWidth?: boolean;
  value: Country | Country[] | null;
  onChange: (value: Country | Country[] | null) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  label = "Search...",
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
        filterOptions={(options, { inputValue }) =>
          options.filter((o) =>
            o.label.toLowerCase().includes(inputValue.toLowerCase())
          )
        }
        disableCloseOnSelect={multiple}
        openOnFocus
        ListboxProps={{
          sx: {
            maxHeight: 320,
            borderRadius: "10px",
            boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
            bgcolor: "background.paper",
            overflow: "auto",
            // subtle scrollbar styling can be added here if desired
          },
        }}
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
                // separator between rows
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                "&:last-of-type": { borderBottom: "none" },
                // hover highlight
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
            placeholder={label}
            variant="outlined"
            size="small"
            InputProps={{
              ...params.InputProps,
              sx: { height: 44, borderRadius: "12px" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          />
        )}
      />
    </FormControl>
  );
};

export default CountrySelect;
