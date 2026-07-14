import type { WeatherResponse } from "@/types/weather";

import {
  getConditionSeverity,
  getTodayPrecip,
  getTodayRange,
  roundScore,
  toCelsius,
  toKmh,
} from "./utils";

export type ComfortScoreResult = {
  score: number;
  label: string;
  factors: {
    temperature: number;
    wind: number;
    humidity: number;
    sky: number;
  };
  summary: string;
};

export function calculateComfortScore(
  weather: WeatherResponse
): ComfortScoreResult {
  const tempC = toCelsius(weather.current.temperature, weather.units);
  const windKmh = toKmh(weather.current.windspeed, weather.units);
  const humidity = weather.current.humidity ?? weather.daily[0]?.humidity;
  const range = getTodayRange(weather);
  const precip = getTodayPrecip(weather);

  const tempComfort = roundScore(100 - Math.abs(tempC - 22) * 5.5);
  const windComfort = roundScore(100 - Math.max(0, windKmh - 8) * 2.2);
  const humidityComfort =
    typeof humidity === "number"
      ? roundScore(100 - Math.abs(humidity - 45) * 1.4)
      : roundScore(100 - getConditionSeverity(weather.current.weathercode) * 20);
  const skyComfort = roundScore(
    100 -
      getConditionSeverity(weather.current.weathercode) * 55 -
      Math.min(25, precip * 4)
  );

  const score = roundScore(
    tempComfort * 0.35 +
      windComfort * 0.25 +
      humidityComfort * 0.2 +
      skyComfort * 0.2
  );

  const label =
    score >= 80
      ? "Very comfortable"
      : score >= 65
        ? "Comfortable"
        : score >= 50
          ? "Mixed comfort"
          : score >= 35
            ? "Uncomfortable"
            : "Stressful";

  const summary = `Comfort feels ${label.toLowerCase()} across a ${Math.round(range.min)}–${Math.round(range.max)}°C day range.`;

  return {
    score,
    label,
    factors: {
      temperature: tempComfort,
      wind: windComfort,
      humidity: humidityComfort,
      sky: skyComfort,
    },
    summary,
  };
}
