import React from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";

interface DropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChange,
}) => {
  const base = label.replace(/\s+/g, "-").toLowerCase();
  const labelId = `${base}-label`;
  const selectId = `${base}-select`;

  return (
    <FormControl
      fullWidth
      variant="outlined"
      sx={{ "& .MuiOutlinedInput-notchedOutline": { transition: "none" } }}
    >
      {/* Label rendered ONCE */}
      <InputLabel id={labelId}>{label}</InputLabel>

      {/* Select reserves notch space with `label` prop */}
      <Select
        labelId={labelId}
        id={selectId}
        value={value}
        onChange={onChange}
        label={label} // ✅ needed for notch, avoids cut
        MenuProps={{
          disableScrollLock: true,
          keepMounted: true,
          transitionDuration: 0,
          PaperProps: { sx: { maxHeight: 320 } },
        }}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Dropdown;
