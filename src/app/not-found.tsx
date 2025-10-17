// app/not-found.tsx
"use client";

import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";

export default function NotFound() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="background.default"
      color="text.primary"
      textAlign="center"
      px={2}
      gap={3}
    >
      {/* Large playful title */}
      <Typography variant="h1" fontSize={80} fontWeight="bold" color="primary">
        🚧
      </Typography>

      {/* Main message */}
      <Typography variant="h4" fontWeight="bold">
        Under Progress
      </Typography>

      <Typography variant="body1" color="text.secondary" maxWidth={400}>
        This page is under construction or the feature is still in progress. We
        are working hard to bring it to you soon!
      </Typography>

      {/* Navigation button */}
      <Link href="/" passHref>
        <Button variant="contained" color="primary" size="large">
          Go Back Home
        </Button>
      </Link>

      {/* Optional fun subtext */}
      <Typography variant="caption" color="text.secondary" mt={2}>
        Or explore other sections of the site while we finish this feature!
      </Typography>
    </Box>
  );
}
