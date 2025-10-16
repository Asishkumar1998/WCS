import { styled, Tooltip, tooltipClasses } from "@mui/material";

const ToolTip = styled(({ className, ...props }: any) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white, // ✅ white background
    color: theme.palette.grey[900], // dark readable text
    fontSize: "1rem", // ~16px
    fontWeight: 500,
    padding: theme.spacing(1.5, 2),
    borderRadius: 8,
    maxWidth: 360,
    lineHeight: 1.6,
    letterSpacing: "0.2px",
    boxShadow: theme.shadows[4], // subtle card-like shadow
    border: `1px solid ${theme.palette.grey[300]}`, // ✅ clean border
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white,
    "&::before": {
      border: `1px solid ${theme.palette.grey[300]}`,
      backgroundColor: theme.palette.common.white,
    },
  },
}));

export default ToolTip;
