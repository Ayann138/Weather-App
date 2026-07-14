"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "@/components/charts/chart-card";
import { useChartTheme } from "@/hooks/useChartTheme";
import {
  buildTemperatureSeries,
  getTemperatureUnit,
} from "@/lib/chart-data";
import type { WeatherResponse } from "@/types/weather";

export type TemperatureChartProps = {
  weather: WeatherResponse;
  className?: string;
  index?: number;
};

export function TemperatureChart({
  weather,
  className,
  index = 0,
}: TemperatureChartProps) {
  const theme = useChartTheme();
  const data = buildTemperatureSeries(weather);
  const unit = getTemperatureUnit(weather.units);

  return (
    <ChartCard
      index={index}
      className={className}
      title="Temperature"
      description={`Daily high / low (${unit}) from the live forecast`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="tempHighFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.temperature} stopOpacity={0.35} />
              <stop offset="100%" stopColor={theme.temperature} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="tempLowFill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={theme.temperatureSecondary}
                stopOpacity={0.28}
              />
              <stop
                offset="100%"
                stopColor={theme.temperatureSecondary}
                stopOpacity={0.02}
              />
            </linearGradient>
          </defs>
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
            unit={unit}
            width={42}
          />
          <Tooltip
            cursor={{ stroke: theme.grid, strokeWidth: 1 }}
            contentStyle={{
              background: theme.tooltipBg,
              border: `1px solid ${theme.tooltipBorder}`,
              borderRadius: 12,
              color: theme.foreground,
              boxShadow: "0 12px 30px -18px rgba(0,0,0,0.35)",
            }}
            labelStyle={{ color: theme.muted }}
            formatter={(value, name) => [
              `${value}${unit}`,
              name === "high" ? "High" : "Low",
            ]}
          />
          <Legend
            wrapperStyle={{ color: theme.muted, fontSize: 12, paddingTop: 8 }}
            formatter={(value) => (value === "high" ? "High" : "Low")}
          />
          <Area
            type="monotone"
            dataKey="high"
            name="high"
            stroke={theme.temperature}
            fill="url(#tempHighFill)"
            strokeWidth={2.5}
            isAnimationActive
            animationDuration={900}
            animationEasing="ease-out"
            activeDot={{ r: 4 }}
          />
          <Area
            type="monotone"
            dataKey="low"
            name="low"
            stroke={theme.temperatureSecondary}
            fill="url(#tempLowFill)"
            strokeWidth={2}
            isAnimationActive
            animationDuration={900}
            animationEasing="ease-out"
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
