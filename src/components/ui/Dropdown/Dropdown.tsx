// components/Dropdown.tsx
import React from 'react';
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';

interface DropdownProps {
    label: string;
    options: string[];
    value: string;
    onChange: (event: SelectChangeEvent<string>) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, value, onChange }) => {
    return (
        <FormControl fullWidth variant="outlined">
            <InputLabel>{label}</InputLabel>
            <Select value={value} onChange={onChange}>
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
