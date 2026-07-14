"use client";

import { motion } from "framer-motion";

import { AiSummaryCard } from "@/components/ai-summary-card";
import { WeatherChartsSection } from "@/components/charts/weather-charts-section";
import { HeroWeatherCard } from "@/components/hero-weather-card";
import { MissionControlInsights } from "@/components/mission-control-insights";
import { WeatherMetricsGrid } from "@/components/weather-metrics-grid";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatDayLabel,
  formatHourLabel,
  formatPrecipitation,
  formatTemperature,
  getWeatherLabel,
} from "@/lib/weather-format";
import { getWeatherIcon } from "@/lib/weather-icons";
import { analyzeWeather } from "@/services/weather-intelligence";
import type { SelectedLocation } from "@/types/location";
import type { WeatherResponse } from "@/types/weather";

type WeatherResultsProps = {
  location: SelectedLocation;
  weather: WeatherResponse;
};

export function WeatherResults({ location, weather }: WeatherResultsProps) {
  const { current, daily, hourly, units, ai_summary } = weather;
  const nextHours = hourly.slice(0, 12);
  const today = daily[0];
  const intelligence = analyzeWeather(weather);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col gap-5 sm:gap-6"
    >
      <HeroWeatherCard
        location={location}
        current={current}
        today={today}
        units={units}
      />

      <AiSummaryCard
        summary={ai_summary}
        generatedAt={current.time}
        locationName={location.name}
      />

      <MissionControlInsights
        weather={weather}
        intelligence={intelligence}
      />

      <WeatherMetricsGrid weather={weather} />

      <WeatherChartsSection weather={weather} />

      <Card className="border-transparent bg-card/90 shadow-sm ring-1 ring-foreground/8 dark:bg-card/70 dark:ring-white/10">
        <CardHeader>
          <CardTitle>Daily forecast</CardTitle>
          <CardDescription>
            Next {daily.length} day{daily.length === 1 ? "" : "s"} for{" "}
            {location.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {daily.map((day) => {
              const DayIcon = getWeatherIcon(day.weathercode, 1);

              return (
                <li
                  key={day.date}
                  className="rounded-xl bg-muted/50 px-3 py-3 dark:bg-muted/30"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {formatDayLabel(day.date)}
                    </p>
                    <DayIcon className="size-4 text-muted-foreground" aria-hidden />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {getWeatherLabel(day.weathercode)}
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {formatTemperature(day.temp_min, units)} /{" "}
                    {formatTemperature(day.temp_max, units)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Precip {formatPrecipitation(day.precipitation)}
                  </p>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-transparent bg-card/90 shadow-sm ring-1 ring-foreground/8 dark:bg-card/70 dark:ring-white/10">
        <CardHeader>
          <CardTitle>Next hours</CardTitle>
          <CardDescription>Upcoming hourly conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="flex gap-2 overflow-x-auto pb-1">
            {nextHours.map((hour) => {
              const HourIcon = getWeatherIcon(hour.weathercode, current.is_day);

              return (
                <li
                  key={hour.time}
                  className="min-w-[4.75rem] rounded-xl bg-muted/50 px-3 py-3 text-center dark:bg-muted/30"
                >
                  <p className="text-xs text-muted-foreground">
                    {formatHourLabel(hour.time)}
                  </p>
                  <HourIcon
                    className="mx-auto mt-2 size-4 text-muted-foreground"
                    aria-hidden
                  />
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {formatTemperature(hour.temp, units)}
                  </p>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
