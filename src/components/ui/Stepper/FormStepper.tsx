import React from "react";
import {
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Typography,
  Box,
  stepConnectorClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";

interface StatusStepperProps {
  steps: string[];
  activeStep: number;
  title?: string;
}

// ✅ Custom connector styling
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`& .${stepConnectorClasses.line}`]: {
    height: 4,
    border: 0,
    backgroundColor: "#808080",
    borderRadius: 1,
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    backgroundColor: "green",
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    backgroundColor: "green",
  },
}));

// ✅ Custom Step Icon Root
const CustomStepIconRoot = styled("div")<{
  ownerState: { active?: boolean; completed?: boolean };
}>(({ ownerState }) => ({
  backgroundColor:
    ownerState.active || ownerState.completed ? "green" : "gray",
  zIndex: 1,
  color: "#fff",
  width: 24,
  height: 24,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  transition: "background-color 0.3s ease",
}));

// ✅ Custom Step Icon — no numbers
function CustomStepIcon(props: {
  active?: boolean;
  completed?: boolean;
}) {
  const { active, completed } = props;

  return (
    <CustomStepIconRoot ownerState={{ active, completed }}>
      {completed ? <CheckIcon fontSize="small" /> : null}
    </CustomStepIconRoot>
  );
}

// ✅ Stepper Component
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
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              slots={{
                stepIcon: CustomStepIcon,
              }}
              slotProps={{
                stepIcon: {
                  active: activeStep === index,
                  completed: activeStep > index,
                },
              }}
            >
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
