// src/components/common/Button.tsx

import React, { ReactNode } from 'react';
import { Button as MUIButton, ButtonProps } from '@mui/material';
import { SxProps, Theme } from '@mui/system';

interface ButtonPropsExtended extends ButtonProps {
    children: ReactNode;
    sx?: SxProps<Theme>;
    loading?: boolean;
}

const Button: React.FC<ButtonPropsExtended> = ({
    children,
    onClick,
    variant = 'contained',
    color = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    startIcon,
    endIcon,
    sx = {},
    ...props
}: ButtonPropsExtended) => {
    return (
        <MUIButton
            onClick={onClick}
            variant={variant}
            color={color}
            size={size}
            disabled={disabled || loading}
            startIcon={startIcon}
            endIcon={endIcon}
            sx={{ ...sx, textTransform: 'none' }}
            {...props}
        >
            {loading ? 'Loading...' : children}
        </MUIButton>
    );
};

export default Button;
