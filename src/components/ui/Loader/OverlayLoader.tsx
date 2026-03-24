"use client";

import { Backdrop, Typography, Box, keyframes } from "@mui/material";

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

export default function OverlayLoader({
  open,
  message = "Processing, please wait...",
}: {
  open: boolean;
  message?: string;
}) {
  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 1,
        color: "#fff",
        backdropFilter: "blur(2px)",
      }}
    >
      <Box textAlign="center" sx={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Bar delay="0s" />
          <Bar delay="0.15s" />
          <Bar delay="0.3s" />
        </Box>
        <Typography mt={2}>{message}</Typography>
        {/* <CircularProgress color="inherit" /> */}
      </Box>
    </Backdrop>
  );
}

// ("use client");

// import { Backdrop, Box } from "@mui/material";
// import { keyframes } from "@mui/system";

// const OverlayLoader = ({ open }: { open: boolean }) => {
//   if (!open) return null;

//   return (
//     <Backdrop
//       open
//       sx={{
//         zIndex: (theme) => theme.zIndex.modal + 1,
//         backgroundColor: "rgba(255, 255, 255, 0.30)",
//       }}
//     ></Backdrop>
//   );
// };

// export default OverlayLoader;
