"use client";

import { Backdrop, Box } from "@mui/material";
import { keyframes } from "@mui/system";

const wave = keyframes`
  0% { transform: scaleY(0.4); opacity: 0.6 }
  50% { transform: scaleY(1); opacity: 1 }
  100% { transform: scaleY(0.4); opacity: 0.6 }
`;

const Bar = ({ delay }: { delay: string }) => (
  <Box
    sx={{
      width: 6,
      height: 36,
      bgcolor: "primary.main",
      borderRadius: 2,
      animation: `${wave} 1.2s ease-in-out infinite`,
      animationDelay: delay,
    }}
  />
);

const Loader = () => {
  return (
    <Backdrop
      open
      sx={{
        zIndex: 2000,
        backgroundColor: "rgba(255, 255, 255, 0.30)",
        // backdropFilter: "blur(1px)",
      }}
    >
      <Box sx={{ display: "flex", gap: 1 }}>
        <Bar delay="0s" />
        <Bar delay="0.15s" />
        <Bar delay="0.3s" />
      </Box>
    </Backdrop>
  );
};

export default Loader;
