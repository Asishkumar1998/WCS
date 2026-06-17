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
  subLabel?: React.ReactNode;
  icon?: React.ReactNode; 
}

interface StatusStepperProps {
  steps: StepData[];
  activeStep: number;
  title?: string;
  orientation?: "vertical" | "horizontal";
  uniformColor?: boolean; // if true, all steps use the same color regardless of state
}

// ===== Custom Connector =====
// const CustomConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 22 },
//   [`& .${stepConnectorClasses.line}`]: {
//     height: 3,
//     border: 0,
//     backgroundColor: theme.palette.divider,
//     borderRadius: 1,
//   },
//   [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
//     backgroundColor: theme.palette.primary.main,
//   },
//   [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
//     backgroundColor: theme.palette.success.main,
//   },
// }));
const CustomConnector = styled(StepConnector)<{
   uniformColor?: boolean;
}>(({ theme,uniformColor  }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 16,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.vertical}`]: {
    marginLeft: 16,
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.divider,
  },
  [`&.${stepConnectorClasses.horizontal} .${stepConnectorClasses.line}`]: {
    borderTopWidth: 3,
    borderRadius: 1,
  },
  [`&.${stepConnectorClasses.vertical} .${stepConnectorClasses.line}`]: {
    borderLeftWidth: 3,
    minHeight: 24,
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.primary.main,
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    borderColor:uniformColor? theme.palette.primary.main:theme.palette.success.main,
  },
}));

// ===== Custom Step Icon =====
const StepIconRoot = styled("div")<{
  ownerState: { active?: boolean; completed?: boolean; isCart?:boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: ownerState.active
    ? theme.palette.primary.main
    : ownerState.completed 
      ?ownerState.isCart
        ? theme.palette.success.main
        : theme.palette.primary.main
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
    ?ownerState.isCart 
      ? `0 0 8px ${theme.palette.primary.main}`
      :"none"
    : "none",
}));

function CustomStepIcon(props: any) {
  const { active, completed, icon, iconMap, totalSteps,uniformColor } = props;

  const defaultIcons: Record<number, React.ReactNode> = {
    1: <FlagCircleIcon fontSize="small" />,
    2: <WorkOutlineIcon fontSize="small" />,
    3: <ScheduleIcon fontSize="small" />,
    4: <CheckCircleIcon fontSize="small" />,
  };

  // If this is the last step, always show the check icon
  const isLastStep = icon === totalSteps;
  const customIcon = iconMap?.[icon - 1];
  // const displayIcon = isLastStep ? (
  //  <CheckCircleIcon fontSize="small" /> 
  // ) : (
  //  (iconMap?.[icon] || defaultIcons[icon] || defaultIcons[1])
  // );
  const displayIcon = customIcon
  ? customIcon
  : isLastStep
    ? <CheckCircleIcon fontSize="small" />
    : (defaultIcons[icon] || defaultIcons[1]);

  return (
    <StepIconRoot ownerState={{ active, completed, isCart: !uniformColor }}>
      {displayIcon}
    </StepIconRoot>
  );
}

// ===== Component =====
export default function StatusStepper({
  steps,
  activeStep,
  title,
  orientation = "vertical",
  uniformColor = false,
}: StatusStepperProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <Box sx={{ width: "100%", p: 2, textAlign: isHorizontal ? "left" : "center" }}>
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
        alternativeLabel={isHorizontal}
        activeStep={activeStep}
        connector={<CustomConnector uniformColor={uniformColor} />}
        orientation={orientation}
        sx={
          isHorizontal
            ? {
                "& .MuiStepLabel-label": {
                  whiteSpace: "normal",
                  textAlign: "center",
                },
                "& .MuiStepLabel-labelContainer": {
                  mt: 0.5,
                },
              }
            : undefined
        }
      >
        {steps.map((step, idx) => (
          <Step key={idx}>
            <StepLabel
              StepIconComponent={(props) => (
                <CustomStepIcon
                  uniformColor={uniformColor}
                  {...props}
                  iconMap={steps.map((s) => s.icon)}
                  totalSteps={steps.length}
                />
              )}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                sx={
                  isHorizontal
                    ? {
                        fontSize: "0.75rem",
                        lineHeight: 1.2,
                      }
                    : undefined
                }
              >
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
