"use client";

import type { ReactNode } from "react";
import {
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  SunMedium,
  Wind,
} from "lucide-react";

import { WeatherMetricCard } from "@/components/weather-metric-card";
import { buildWeatherMetrics } from "@/lib/weather-metrics";
import { cn } from "@/lib/utils";
import type { WeatherMetricId, WeatherResponse } from "@/types/weather";

const METRIC_ICONS: Record<WeatherMetricId, ReactNode> = {
  humidity: <Droplets aria-hidden />,
  wind: <Wind aria-hidden />,
  pressure: <Gauge aria-hidden />,
  visibility: <Eye aria-hidden />,
  uv: <SunMedium aria-hidden />,
  sunrise: <Sunrise aria-hidden />,
  sunset: <Sunset aria-hidden />,
};

export type WeatherMetricsGridProps = {
  weather: WeatherResponse;
  className?: string;
};

export function WeatherMetricsGrid({
  weather,
  className,
}: WeatherMetricsGridProps) {
  const metrics = buildWeatherMetrics(weather);

  return (
    <section
      aria-label="Weather metrics"
      className={cn(
        "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4",
        className
      )}
    >
      {metrics.map((metric, index) => (
        <WeatherMetricCard
          key={metric.id}
          index={index}
          icon={METRIC_ICONS[metric.id]}
          label={metric.label}
          value={metric.value}
          unit={metric.unit}
          subtitle={metric.subtitle}
          className={
            metric.id === "sunset" || metric.id === "sunrise"
              ? "col-span-1"
              : undefined
          }
        />
      ))}
    </section>
  );
}
