"use client";

import { useEffect, useState } from "react";
import CustomPieChart from "./PieChart";
import ShinyBarChartHorizontal from "./ShinyBarChartHorizontal";
import { getGraphData } from "@/services/dashboardService";
import { Grid } from "@mui/material";
import ChartCard from "@/components/features/Dashboard/ChartCard";
import { getAuth } from "@/app/utils/auth";

type ChartItem = {
  label: string;
  value: number;
};

export default function ChartsWrapper() {
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();

    if (auth) {
      setUserId(auth.userId);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    async function loadCharts() {
      try {
        const apiData = await getGraphData(Number(userId));

        const mapped = apiData.map((item: any) => ({
          label: item.countryShortName.trim(),
          value: item.docCount,
        }));

        setChartData(mapped);
      } catch (err) {
        console.error("Chart data error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCharts();
  }, [userId]);

  if (loading) return null;

  return (
    <>
      <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex" }}>
        <ChartCard>
          <ShinyBarChartHorizontal data={chartData} />
        </ChartCard>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex" }}>
        <ChartCard>
          <CustomPieChart data={chartData} />
        </ChartCard>
      </Grid>
    </>
  );
}
