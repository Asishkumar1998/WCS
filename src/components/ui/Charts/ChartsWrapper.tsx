"use client";

import { useEffect, useState } from "react";
import CustomPieChart from "./PieChart";
import ShinyBarChartHorizontal from "./ShinyBarChartHorizontal";
import { getGraphData } from "@/services/dashboardService";

type ChartItem = {
  label: string;
  value: number;
};

export default function ChartsWrapper() {
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCharts() {
      try {
        const apiData = await getGraphData(7437);

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
  }, []);

  if (loading) return null; // or skeleton loader

  return (
    <>
      <ShinyBarChartHorizontal data={chartData} />
      <CustomPieChart data={chartData} />
    </>
  );
}
