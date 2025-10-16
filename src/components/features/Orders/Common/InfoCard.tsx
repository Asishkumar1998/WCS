"use client";
import { Card, CardContent, Box, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface InfoCardProps {
  message?: string;
  visible?: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({
  message = "This is an informational message for users.",
  visible = false,
}) => {
  if (!visible) return null;

  return (
    <Card
      sx={{
        width: "100%",
        backgroundColor: "primary.main",
        borderLeft: "6px solid #E63946",
        borderRadius: 2,
        boxShadow: 3,
        color: "#FFFFFF",
        display: "flex",
        alignItems: "center",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <InfoOutlinedIcon fontSize="medium" />
          <Typography variant="body2" sx={{ color: "#E0E0E0" }}>
            {message}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InfoCard;
