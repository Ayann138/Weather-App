import type { WeatherResponse } from "@/types/weather";

import {
  getConditionSeverity,
  getTodayPrecip,
  toCelsius,
  toKmh,
} from "./utils";

export type HydrationAdvice = {
  level: "low" | "moderate" | "high" | "critical";
  liters: number;
  intervalMinutes: number;
  advice: string;
  reasons: string[];
};

export function adviseHydration(weather: WeatherResponse): HydrationAdvice {
  const tempC = toCelsius(weather.current.temperature, weather.units);
  const windKmh = toKmh(weather.current.windspeed, weather.units);
  const humidity = weather.current.humidity ?? weather.daily[0]?.humidity;
  const uv = weather.current.uv_index ?? weather.daily[0]?.uv_index;
  const precip = getTodayPrecip(weather);
  const severity = getConditionSeverity(weather.current.weathercode);

  let liters = 1.8;
  const reasons: string[] = [];

  const heatOffset = Math.max(0, tempC - 20) * 0.065;
  liters += heatOffset;
  if (heatOffset > 0.15) {
    reasons.push(`Air temperature is ${Math.round(tempC)}°C`);
  }

  if (typeof humidity === "number") {
    const humidityOffset = Math.max(0, humidity - 50) * 0.012;
    liters += humidityOffset;
    if (humidityOffset > 0.1) {
      reasons.push(`Humidity is elevated at ${Math.round(humidity)}%`);
    }
  } else if (severity > 0.35) {
    liters += severity * 0.35;
    reasons.push("Sky conditions increase exertion risk");
  }

  if (typeof uv === "number" && uv >= 6) {
    liters += (uv - 5) * 0.08;
    reasons.push(`UV index is ${uv.toFixed(1)}`);
  }

  if (windKmh > 25 && tempC > 24) {
    liters += 0.2;
    reasons.push("Warm drying wind increases fluid loss");
  }

  if (precip >= 2) {
    liters = Math.max(1.6, liters - 0.15);
    reasons.push("Wet conditions reduce outdoor heat exposure");
  }

  liters = Math.round(liters * 10) / 10;

  const level: HydrationAdvice["level"] =
    liters >= 3.2
      ? "critical"
      : liters >= 2.6
        ? "high"
        : liters >= 2.1
          ? "moderate"
          : "low";

  const intervalMinutes = Math.max(
    20,
    Math.round(75 - (liters - 1.8) * 18)
  );

  const advice = `Aim for about ${liters.toFixed(1)} L today and sip roughly every ${intervalMinutes} minutes while outdoors.`;

  if (reasons.length === 0) {
    reasons.push("Baseline fluid needs for current outdoor conditions");
  }

  return { level, liters, intervalMinutes, advice, reasons };
}
