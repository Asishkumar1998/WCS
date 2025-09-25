import { Box, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts";

export default function CustomPieChart() {
  const data = [
    { label: "Mexico", value: 400, color: "#0088FE" },
    { label: "US", value: 300, color: "#00C49F" },
    { label: "Colombia", value: 300, color: "#FFBB28" },
    { label: "Egypt", value: 200, color: "#FF8042" },
  ];

  const settings = {
    margin: { right: 5 },
    width: 200,
    height: 200,
  };
  return (
    <Box width={"100%"}>
      <Typography align="center" marginBottom={2}>
        Count of Documents by Country
      </Typography>
      <PieChart
        series={[
          { innerRadius: 50, outerRadius: 100, data, arcLabel: "value" },
        ]}
        {...settings}
      />
    </Box>
  );
}
