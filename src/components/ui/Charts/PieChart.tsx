import { Box, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts";

type ChartItem = {
  label: string;
  value: number;
};

export default function CustomPieChart({ data }: { data: ChartItem[] }) {

  const settings = {
    margin: { right: 5 },
    width: 200,
    height: 200,
  };
  return (
    <Box width={"100%"}>
      <Typography align="center" marginBottom={5} fontWeight={800}>
        Country-Based Document Volume
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
