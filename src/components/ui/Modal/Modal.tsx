"use client";

import React, { JSX } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";

type ModalType = "warning" | "error" | "success" | "info" | "custom";

interface AppModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  type?: ModalType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showActions?: boolean;
  children?: React.ReactNode;
}

const typeStyles: Record<ModalType, { icon: JSX.Element; color: string }> = {
  warning: {
    icon: (
      <WarningAmberRoundedIcon sx={{ fontSize: 40, color: "warning.main" }} />
    ),
    color: "#f57c00",
  },
  error: {
    icon: (
      <ErrorOutlineRoundedIcon sx={{ fontSize: 40, color: "error.main" }} />
    ),
    color: "#d32f2f",
  },
  success: {
    icon: (
      <CheckCircleRoundedIcon sx={{ fontSize: 40, color: "success.main" }} />
    ),
    color: "#2e7d32",
  },
  info: {
    icon: <InfoOutlinedIcon sx={{ fontSize: 40, color: "info.main" }} />,
    color: "#0288d1",
  },
  custom: {
    icon: <></>,
    color: "#000",
  },
};

const Modal: React.FC<AppModalProps> = ({
  open,
  onClose,
  title,
  message,
  type = "info",
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  showActions = true,
  children,
}) => {
  const { icon, color } = typeStyles[type];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 3, p: 1.5, overflow: "hidden" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          pt: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {type !== "custom" && icon}
          <DialogTitle sx={{ p: 0, fontWeight: 600, color }}>
            {title}
          </DialogTitle>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent dividers sx={{ px: 3, py: 2 }}>
        {message && (
          <Typography sx={{ mb: children ? 2 : 0 }}>{message}</Typography>
        )}
        {children}
      </DialogContent>

      {showActions && (
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit">
            {cancelText}
          </Button>
          {onConfirm && (
            <Button
              onClick={onConfirm}
              variant="contained"
              color={
                type === "error"
                  ? "error"
                  : type === "warning"
                  ? "warning"
                  : "primary"
              }
            >
              {confirmText}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Modal;
