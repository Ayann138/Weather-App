"use client";

import { ComfortChart } from "@/components/charts/comfort-chart";
import { RainChart } from "@/components/charts/rain-chart";
import { TemperatureChart } from "@/components/charts/temperature-chart";
import { cn } from "@/lib/utils";
import type { WeatherResponse } from "@/types/weather";

export type WeatherChartsSectionProps = {
  weather: WeatherResponse;
  className?: string;
};

export function WeatherChartsSection({
  weather,
  className,
}: WeatherChartsSectionProps) {
  return (
    <section
      aria-label="Weather charts"
      className={cn("grid gap-4 lg:grid-cols-2 xl:grid-cols-3", className)}
    >
      <TemperatureChart weather={weather} index={0} className="lg:col-span-2 xl:col-span-1" />
      <RainChart weather={weather} index={1} />
      <ComfortChart weather={weather} index={2} className="lg:col-span-2 xl:col-span-1" />
    </section>
  );
}
