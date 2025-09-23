// src/components/common/InputField.tsx
import React from 'react';
import { TextField } from '@mui/material';

interface InputFieldProps {
    label: string;
    placeholder?: string;
    helperText?: string;
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    placeholder,
    helperText,
    ...props
}: InputFieldProps) => {
    return (
        <TextField
            label={label}
            placeholder={placeholder}
            helperText={helperText}
            fullWidth
            variant="outlined"
            margin="normal"
            {...props}
        />
    );
};

export default InputField;
