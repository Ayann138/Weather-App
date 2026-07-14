import type { WeatherResponse } from "@/types/weather";

import {
  getConditionSeverity,
  getPrecipIntensity,
  getTodayPrecip,
  getTodayRange,
  roundScore,
  toCelsius,
  toKmh,
} from "./utils";

export type WeatherScoreResult = {
  score: number;
  label: string;
  summary: string;
};

export function calculateWeatherScore(
  weather: WeatherResponse
): WeatherScoreResult {
  const tempC = toCelsius(weather.current.temperature, weather.units);
  const windKmh = toKmh(weather.current.windspeed, weather.units);
  const precip = getTodayPrecip(weather);
  const range = getTodayRange(weather);
  const diurnalSwing = Math.abs(range.max - range.min);

  const conditionPenalty = getConditionSeverity(weather.current.weathercode) * 35;
  const precipPenalty = getPrecipIntensity(precip) * 25;
  const windPenalty = Math.min(25, Math.max(0, (windKmh - 12) * 0.9));

  const idealTemp = 21;
  const tempPenalty = Math.min(30, Math.abs(tempC - idealTemp) * 1.4);
  const swingPenalty = Math.min(10, Math.max(0, diurnalSwing - 10) * 0.7);

  const score = roundScore(
    100 - conditionPenalty - precipPenalty - windPenalty - tempPenalty - swingPenalty
  );

  const label =
    score >= 85
      ? "Excellent"
      : score >= 70
        ? "Good"
        : score >= 55
          ? "Fair"
          : score >= 40
            ? "Challenging"
            : "Harsh";

  const summary = `Overall outdoor quality is ${label.toLowerCase()} at ${Math.round(tempC)}°C with ${Math.round(windKmh)} km/h wind and ${precip.toFixed(1)} mm expected precipitation.`;

  return { score, label, summary };
}
