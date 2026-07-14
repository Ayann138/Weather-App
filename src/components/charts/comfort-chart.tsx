"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "@/components/charts/chart-card";
import { useChartTheme } from "@/hooks/useChartTheme";
import {
  buildComfortSeries,
  getTemperatureUnit,
} from "@/lib/chart-data";
import type { WeatherResponse } from "@/types/weather";

export type ComfortChartProps = {
  weather: WeatherResponse;
  className?: string;
  index?: number;
};

export function ComfortChart({
  weather,
  className,
  index = 2,
}: ComfortChartProps) {
  const theme = useChartTheme();
  const data = buildComfortSeries(weather);
  const tempUnit = getTemperatureUnit(weather.units);

  return (
    <ChartCard
      index={index}
      className={className}
      title="Comfort"
      description="Hourly outdoor comfort score (0–100) derived from live conditions"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid stroke={theme.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: theme.muted, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            minTickGap={18}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: theme.muted, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={36}
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
            formatter={(value, name, item) => {
              if (name === "comfort") {
                return [`${value}/100`, "Comfort"];
              }

              const temperature = item?.payload?.temperature;
              return [
                typeof temperature === "number"
                  ? `${temperature}${tempUnit}`
                  : `${value}`,
                "Temperature",
              ];
            }}
          />
          <Line
            type="monotone"
            dataKey="comfort"
            name="comfort"
            stroke={theme.comfort}
            strokeWidth={2.75}
            dot={false}
            activeDot={{ r: 5 }}
            isAnimationActive
            animationDuration={950}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
