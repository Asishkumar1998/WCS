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
import { createFilterOptions } from "@mui/material/Autocomplete";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { Key } from "@mui/icons-material";

interface Country {
  countryId: number;
  countryName: string;
  countryShortName: string;
  genC2ACode: string;
  genC3ACode: string;
  countryTypeId: number;
  isEmbassyOOS: number;
  nusaccRequired: number;
  processDays: number;
  active: number;
  SosException: number;
  isShipping: number;
  copies: number;
  shippingCopies: number;
  physicalRequired: number;
  shippingException: number;
  isEMBShipping: number;
  regionId: number;
}

interface CountrySelectProps {
  label?: string;
  multiple?: boolean;
  fullWidth?: boolean;
  value: Country | Country[] | null;
  onChange: (value: Country | Country[] | null) => void;
  style?: React.CSSProperties;
}

// Custom filter to include both short and full names
const filter = createFilterOptions<Country>({
  stringify: (option) =>
    `${option.countryName} ${option.countryShortName} ${option.genC2ACode}`,
});

const CountrySelect: React.FC<CountrySelectProps> = ({
  label = "Select country",
  multiple = false,
  fullWidth = true,
  value = null,
  onChange,
  style = {},
}) => {
  const { countries } = useSelector((state: RootState) => state.formsData);

  return (
    <FormControl fullWidth={fullWidth}>
      <Autocomplete
        multiple={multiple}
        options={countries}
        getOptionLabel={(option) => option.countryShortName || ""}
        filterOptions={(options, params) => filter(options, params)}
        value={value as any}
        onChange={(_, newValue) => onChange(newValue as any)}
        disableCloseOnSelect={multiple}
        disableClearable={!multiple}
        openOnFocus
        ListboxProps={{ style: { maxHeight: 320 } }}
        sx={{ ...style }}
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
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
                  src={
                    option.genC2ACode
                      ? `https://flagcdn.com/w20/${option.genC2ACode.toLowerCase()}.png`
                      : "/images/placeholder-flag.png"
                  }
                  alt={option.countryShortName}
                  sx={{ width: 24, height: 18, borderRadius: "3px" }}
                  variant="square"
                />
                <Box component="span" sx={{ ml: 0.5, fontSize: "0.95rem" }}>
                  {option.countryShortName}
                </Box>
              </Box>
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField {...params} label={label} variant="outlined" />
        )}
      />
    </FormControl>
  );
};

export default CountrySelect;
