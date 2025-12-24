import { Card, CardContent, Box, Typography, Avatar } from "@mui/material";
import Image from "next/image";

interface RetailServiceCardProps {
  icon: string;
  title: string;
  description?: string;
  onClick?: () => void;
}

const RetailServiceCard = ({
  icon,
  title,
  description,
  onClick,
}: RetailServiceCardProps) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        height: "100%",
        // minHeight: 160,
        cursor: "pointer",
        borderRadius: 2,
        border: "1px solid #e0e0e0",
        transition: "all 0.25s ease",
        backgroundColor: "#fff",

        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 28px rgba(0,0,0,0.12)",
          borderColor: "#1976d2",
        },
      }}
    >
      <CardContent
        sx={{
          height: "150px",
          p: 3,
          display: "flex",
          alignItems: "flex-start",
          alignContent: "center",
          width: "400px",
        }}
      >
        {/* Icon */}
        <Avatar
          sx={{
            width: 56,
            height: 56,
            mr: 2.5,
            bgcolor: "#f5f5f5",
            flexShrink: 0,
          }}
        >
          <Image src={icon} alt={title} height={36} width={36} />
        </Avatar>

        {/* Text */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#2c3e50",
              mb: 0.5,
            }}
          >
            {title}
          </Typography>

          {description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.6 }}
            >
              {description}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default RetailServiceCard;
