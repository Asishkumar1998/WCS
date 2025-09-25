import { Card, CardContent } from "@mui/material";

const ChartCard = ({ children }: { children: any }) => {
  return (
    <Card
      sx={{
        transition: "all 0.3s ease",
        border: "1px solid #e0e0e0",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          borderColor: "#1976d2",
        },
        flex: 1,
      }}
    >
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default ChartCard;
