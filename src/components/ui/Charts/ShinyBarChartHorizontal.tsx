"use client";

import * as React from "react";
import { useTheme, styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import {
  BarChart,
  type BarLabelProps,
  type BarProps,
} from "@mui/x-charts/BarChart";
import { useAnimate, useAnimateBar, useDrawingArea } from "@mui/x-charts/hooks";
import { PiecewiseColorLegend } from "@mui/x-charts/ChartsLegend";
import { interpolateObject } from "@mui/x-charts-vendor/d3-interpolate";
import Box from "@mui/material/Box";

type ChartItem = {
  label: string;
  value: number;
};

export default function ShinyBarChartHorizontal({
  data,
}: {
  data: ChartItem[];
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const dataset = data.map((item) => ({
    country: item.label,
    percentage:
      total === 0 ? 0 : Number(((item.value / total) * 100).toFixed(1)),
  }));

  // const dataset = data.map((item) => ({
  //   country: item.label,
  //   turnout: item.value,
  // }));

  // const maxValue = Math.max(...dataset.map((d) => d.turnout), 0);

  return (
    <Box width="100%">
      <Typography align="center" marginBottom={2} fontWeight={800}>
        Document Share (%) — Top 5 Countries
      </Typography>
      <BarChart
        height={250}
        margin={{ left: -40 }}
        dataset={dataset}
        series={[
          {
            id: "percentage",
            dataKey: "percentage",
            valueFormatter: (value) => (value === null ? null : `${value}%`),
          },
        ]}
        layout="horizontal"
        xAxis={[
          {
            min: 0,
            max: 100,
            valueFormatter: (value: any) => `${value}%`,
            colorMap: {
              type: "piecewise",
              thresholds: [30, 70],
              colors: ["#d32f2f", "#78909c", "#1976d2"],
            },
          },
        ]}
        barLabel={(v) => (v.value === null ? null : `${v.value}%`)}
        yAxis={[
          {
            scaleType: "band",
            dataKey: "country",
            width: 140,
          },
        ]}
        slots={{
          legend: PiecewiseColorLegend,
          barLabel: BarLabelAtBase,
          bar: BarShadedBackground,
        }}
      />
    </Box>
  );
}

// ---------------- Bar with shaded background ----------------
export function BarShadedBackground(props: BarProps) {
  const { ownerState, x, y, width, height } = props; // only used props
  const theme = useTheme();
  const animatedProps = useAnimateBar(props);
  const { width: drawingWidth } = useDrawingArea();

  return (
    <React.Fragment>
      {/* Static background */}
      <rect
        x={x}
        y={y}
        width={drawingWidth}
        height={height}
        fill={(theme.vars || theme).palette.text.primary}
        opacity={theme.palette.mode === "dark" ? 0.05 : 0.1}
      />

      {/* Animated foreground bar */}
      <rect
        x={animatedProps.x ?? x}
        y={animatedProps.y ?? y}
        width={width}
        height={height}
        filter={ownerState.isHighlighted ? "brightness(120%)" : undefined}
        opacity={ownerState.isFaded ? 0.3 : 1}
        data-highlighted={ownerState.isHighlighted || undefined}
        data-faded={ownerState.isFaded || undefined}
      />
    </React.Fragment>
  );
}

// ---------------- Label text styling ----------------
const Text = styled("text")(({ theme }) => ({
  ...theme?.typography?.body2,
  stroke: "none",
  fill: (theme.vars || theme).palette.common.white,
  transition: "opacity 0.2s ease-in, fill 0.2s ease-in",
  textAnchor: "start",
  dominantBaseline: "central",
  pointerEvents: "none",
  fontWeight: 600,
}));

// ---------------- Bar label at base ----------------
function BarLabelAtBase(props: BarLabelProps) {
  const { xOrigin, y, height, skipAnimation, ...otherProps } = props; // only used props

  const animatedProps = useAnimate(
    { x: xOrigin + 8, y: y + height / 2 },
    {
      initialProps: { x: xOrigin, y: y + height / 2 },
      createInterpolator: interpolateObject,
      transformProps: (p) => p,
      applyProps: (element: SVGTextElement, p) => {
        element.setAttribute("x", p.x.toString());
        element.setAttribute("y", p.y.toString());
      },
      skip: skipAnimation,
    }
  );

  return <Text {...otherProps} {...animatedProps} />;
}
