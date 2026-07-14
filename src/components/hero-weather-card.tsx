"use client";

import { motion } from "framer-motion";

import {
  formatTemperature,
  getWeatherLabel,
} from "@/lib/weather-format";
import {
  estimateFeelsLike,
  formatFullDate,
  getHeroAtmosphere,
  getWeatherIcon,
} from "@/lib/weather-icons";
import { cn } from "@/lib/utils";
import type { SelectedLocation } from "@/types/location";
import type {
  CurrentWeather,
  DailyWeather,
  WeatherUnits,
} from "@/types/weather";

export type HeroWeatherCardProps = {
  location: SelectedLocation;
  current: CurrentWeather;
  today?: DailyWeather;
  units?: WeatherUnits;
  className?: string;
};

export function HeroWeatherCard({
  location,
  current,
  today,
  units = "metric",
  className,
}: HeroWeatherCardProps) {
  const WeatherIcon = getWeatherIcon(current.weathercode, current.is_day);
  const condition = getWeatherLabel(current.weathercode);
  const feelsLike = estimateFeelsLike(current.temperature, current.windspeed);
  const atmosphere = getHeroAtmosphere(current.is_day, current.weathercode);
  const dateSource = today?.date ?? current.time.split("T")[0] ?? current.time;

  const high = today?.temp_max;
  const low = today?.temp_min;

  return (
    <motion.section
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] text-white shadow-[0_20px_50px_-24px_rgba(15,40,80,0.55)] sm:rounded-[2rem]",
        className
      )}
      aria-label={`Current weather in ${location.name}`}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br transition-colors duration-700",
          atmosphere
        )}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.22),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.12),transparent_50%)]" />

      <div className="relative flex min-h-[22rem] flex-col px-6 py-7 sm:min-h-[24rem] sm:px-8 sm:py-8 md:px-10 md:py-9">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.4 }}
          className="text-center"
        >
          <p className="text-lg font-medium tracking-tight text-white/95 sm:text-xl">
            {location.name}
          </p>
          <p className="mt-0.5 text-sm text-white/70 sm:text-base">
            {location.country}
          </p>
          <p className="mt-2 text-xs font-medium tracking-[0.08em] text-white/60 uppercase sm:text-sm sm:tracking-[0.12em]">
            {formatFullDate(dateSource)}
          </p>
        </motion.div>

        <div className="mt-6 flex flex-1 flex-col items-center justify-center gap-1 sm:mt-8 sm:gap-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.45, ease: "easeOut" }}
            className="flex items-center gap-3 sm:gap-5"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="drop-shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
            >
              <WeatherIcon
                className="size-16 text-white/95 sm:size-20 md:size-24"
                strokeWidth={1.25}
                aria-hidden
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="text-[5.5rem] leading-none font-thin tracking-tight sm:text-[6.5rem] md:text-[7.5rem]"
            >
              {Math.round(current.temperature)}°
            </motion.p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.32, duration: 0.35 }}
            className="text-lg font-medium text-white/90 sm:text-xl"
          >
            {condition}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.4 }}
          className="mt-6 flex flex-col items-center gap-3 sm:mt-8"
        >
          <p className="text-sm text-white/75 sm:text-base">
            Feels like {formatTemperature(feelsLike, units)}
          </p>

          <div className="flex items-center gap-4 rounded-full bg-white/12 px-5 py-2.5 text-sm backdrop-blur-md sm:gap-6 sm:px-6 sm:text-base">
            <span className="font-medium text-white/95">
              <span className="text-white/60">H </span>
              {high !== undefined
                ? formatTemperature(high, units)
                : "—"}
            </span>
            <span className="h-4 w-px bg-white/25" aria-hidden />
            <span className="font-medium text-white/95">
              <span className="text-white/60">L </span>
              {low !== undefined
                ? formatTemperature(low, units)
                : "—"}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
