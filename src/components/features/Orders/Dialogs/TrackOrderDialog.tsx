"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Box,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface TrackOrderDialogProps {
  open: boolean;
  onClose: () => void;
  orderId: number;
  docId: number;
  steps: {
    label: string;
    date?: string;
    description?: string;
    completed?: boolean;
  }[];
  returnInstructions?: string;
}

export default function TrackOrderDialog({
  open,
  onClose,
  orderId,
  docId,
  steps,
  returnInstructions,
}: TrackOrderDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "white",
          fontWeight: "bold",
          mb: 4,
          position: "relative",
          pr: 6,
        }}
      >
        Track Details (Order ID: {orderId})
        <Typography
          variant="subtitle2"
          sx={{ color: "white", fontWeight: 400 }}
        >
          Doc Id: {docId}
        </Typography>
        {/* Close Icon */}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ py: 3 }}>
        {/* Stepper */}
        <Stepper alternativeLabel>
          {steps.map((step, index) => (
            <Step key={index} completed={step.completed}>
              <StepLabel>
                <Typography fontWeight="bold">{step.label}</Typography>
                {step.date && (
                  <Typography variant="caption" color="text.secondary">
                    {step.date}
                  </Typography>
                )}
                {step.description && (
                  <Typography variant="caption" color="text.secondary">
                    {step.description}
                  </Typography>
                )}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Divider sx={{ my: 3 }} />

        {/* Return Shipping Instructions */}
        {returnInstructions && (
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Return Shipping Instructions:
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {returnInstructions}
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
