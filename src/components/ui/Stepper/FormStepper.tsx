import React from "react";
import {
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Typography,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";

interface StatusStepperProps {
  steps: string[];
  activeStep: number;
  title?: string; // optional, defaults to "Timeline"
}

// Custom connector styling
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`& .${StepConnector.line}`]: {
    height: 4,
    border: 0,
    backgroundColor: "#808080",
    borderRadius: 1,
  },
  [`&.${StepConnector.active} .${StepConnector.line}`]: {
    backgroundColor: "green",
  },
  [`&.${StepConnector.completed} .${StepConnector.line}`]: {
    backgroundColor: "green",
  },
}));

// Custom step icon
const CustomStepIcon = styled("div")<{ active: boolean }>(({ active }) => ({
  backgroundColor: active ? "green" : "gray",
  zIndex: 1,
  color: "#fff",
  width: 24,
  height: 24,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
}));

function CustomStepIconComponent({
  active,
}: {
  active: boolean;
  completed?: boolean;
  className?: string;
}) {
  return <CustomStepIcon active={!!active} />;
}

export default function StatusStepper({
  steps,
  activeStep,
  title = "Timeline",
}: StatusStepperProps) {
  return (
    <Box sx={{ width: "100%", margin: "20px auto", textAlign: "center" }}>
      {/* Title */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          marginBottom: 3,
          color: "#333",
          letterSpacing: 0.5,
        }}
      >
        {title}
      </Typography>

      {/* Stepper */}
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<CustomConnector />}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={CustomStepIconComponent}>
              <Typography sx={{ fontSize: "0.9rem", fontWeight: 500 }}>
                {label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
