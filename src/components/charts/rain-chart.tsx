"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "@/components/charts/chart-card";
import { useChartTheme } from "@/hooks/useChartTheme";
import { buildRainSeries } from "@/lib/chart-data";
import type { WeatherResponse } from "@/types/weather";

export type RainChartProps = {
  weather: WeatherResponse;
  className?: string;
  index?: number;
};

export function RainChart({
  weather,
  className,
  index = 1,
}: RainChartProps) {
  const theme = useChartTheme();
  const data = buildRainSeries(weather);

  return (
    <ChartCard
      index={index}
      className={className}
      title="Rain"
      description="Precipitation totals (mm) from the live forecast"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid stroke={theme.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: theme.muted, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            minTickGap={18}
          />
          <YAxis
            tick={{ fill: theme.muted, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            unit="mm"
            width={42}
            allowDecimals
          />
          <Tooltip
            cursor={{ fill: theme.grid, opacity: 0.35 }}
            contentStyle={{
              background: theme.tooltipBg,
              border: `1px solid ${theme.tooltipBorder}`,
              borderRadius: 12,
              color: theme.foreground,
              boxShadow: "0 12px 30px -18px rgba(0,0,0,0.35)",
            }}
            labelStyle={{ color: theme.muted }}
            formatter={(value) => [`${value} mm`, "Precipitation"]}
          />
          <Bar
            dataKey="precipitation"
            name="precipitation"
            fill={theme.rain}
            radius={[8, 8, 4, 4]}
            isAnimationActive
            animationDuration={900}
            animationEasing="ease-out"
            maxBarSize={42}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
