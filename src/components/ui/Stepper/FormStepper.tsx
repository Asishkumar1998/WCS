"use client";
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
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FlagCircleIcon from "@mui/icons-material/FlagCircle";

// ===== Types =====
interface StepData {
  label: string;
  subLabel?: string;
  icon?: React.ReactNode; // optional icon override
}

interface StatusStepperProps {
  steps: StepData[];
  activeStep: number;
  title?: string;
}

// ===== Custom Connector =====
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 22 },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.divider,
    borderRadius: 1,
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    backgroundColor: theme.palette.primary.main,
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    backgroundColor: theme.palette.success.main,
  },
}));

// ===== Custom Step Icon =====
const StepIconRoot = styled("div")<{
  ownerState: { active?: boolean; completed?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: ownerState.active
    ? theme.palette.primary.main
    : ownerState.completed
    ? theme.palette.success.main
    : theme.palette.grey[300],
  color: "#fff",
  display: "flex",
  borderRadius: "50%",
  width: 32,
  height: 32,
  justifyContent: "center",
  alignItems: "center",
  transition: "all 0.3s ease",
  boxShadow: ownerState.active
    ? `0 0 8px ${theme.palette.primary.main}`
    : "none",
}));

function CustomStepIcon(props: any) {
  const { active, completed, icon, iconMap, totalSteps } = props;

  const defaultIcons: Record<number, React.ReactNode> = {
    1: <FlagCircleIcon fontSize="small" />,
    2: <WorkOutlineIcon fontSize="small" />,
    3: <ScheduleIcon fontSize="small" />,
    4: <CheckCircleIcon fontSize="small" />,
  };

  // If this is the last step, always show the check icon
  const isLastStep = icon === totalSteps;
  const displayIcon = isLastStep ? (
    <CheckCircleIcon fontSize="small" />
  ) : (
    iconMap?.[icon] || defaultIcons[icon] || defaultIcons[1]
  );

  return (
    <StepIconRoot ownerState={{ active, completed }}>
      {displayIcon}
    </StepIconRoot>
  );
}

// ===== Component =====
export default function StatusStepper({
  steps,
  activeStep,
  title,
}: StatusStepperProps) {
  return (
    <Box sx={{ width: "100%", p: 2, textAlign: "center" }}>
      {/* Title */}
      {title && (
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 3,
            color: "text.primary",
            letterSpacing: 0.5,
          }}
        >
          {title}
        </Typography>
      )}

      {/* Stepper */}
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<CustomConnector />}
      >
        {steps.map((step, idx) => (
          <Step key={idx}>
            <StepLabel
              StepIconComponent={(props) => (
                <CustomStepIcon
                  {...props}
                  iconMap={steps.map((s) => s.icon)}
                  totalSteps={steps.length}
                />
              )}
            >
              <Typography variant="body2" fontWeight={600}>
                {step.label}
              </Typography>
              {step.subLabel && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  {step.subLabel}
                </Typography>
              )}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
