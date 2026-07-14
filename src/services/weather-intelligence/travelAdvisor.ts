import type { WeatherResponse } from "@/types/weather";

import {
  getConditionSeverity,
  getPrecipIntensity,
  getTodayPrecip,
  roundScore,
  toCelsius,
  toKmh,
} from "./utils";

export type TravelAdvice = {
  score: number;
  risk: "low" | "moderate" | "high" | "severe";
  modes: Array<{
    mode: "walking" | "cycling" | "driving" | "transit";
    suitability: number;
    note: string;
  }>;
  advice: string;
};

export function adviseTravel(weather: WeatherResponse): TravelAdvice {
  const tempC = toCelsius(weather.current.temperature, weather.units);
  const windKmh = toKmh(weather.current.windspeed, weather.units);
  const precip = getTodayPrecip(weather);
  const precipIntensity = getPrecipIntensity(precip);
  const severity = getConditionSeverity(weather.current.weathercode);
  const visibility = weather.current.visibility ?? weather.daily[0]?.visibility;

  let score = 100;
  score -= severity * 40;
  score -= precipIntensity * 30;
  score -= Math.min(20, Math.max(0, windKmh - 25) * 0.8);

  if (typeof visibility === "number" && visibility < 4) {
    score -= (4 - visibility) * 6;
  }

  if (tempC <= -5 || tempC >= 36) {
    score -= 12;
  }

  score = roundScore(score);

  const risk: TravelAdvice["risk"] =
    score >= 75 ? "low" : score >= 55 ? "moderate" : score >= 35 ? "high" : "severe";

  const walking = roundScore(
    100 - severity * 45 - precipIntensity * 35 - Math.max(0, windKmh - 18) * 1.2
  );
  const cycling = roundScore(
    100 - severity * 50 - precipIntensity * 40 - Math.max(0, windKmh - 14) * 1.6
  );
  const driving = roundScore(
    100 -
      severity * 30 -
      precipIntensity * 25 -
      (typeof visibility === "number" && visibility < 5 ? (5 - visibility) * 8 : 0)
  );
  const transit = roundScore(100 - severity * 20 - precipIntensity * 15);

  const modes: TravelAdvice["modes"] = [
    {
      mode: "walking" as const,
      suitability: walking,
      note:
        walking >= 70
          ? "Comfortable for short and medium walks"
          : "Prefer covered routes and shorter trips",
    },
    {
      mode: "cycling" as const,
      suitability: cycling,
      note:
        cycling >= 70
          ? "Good cycling window if roads are clear"
          : "High exposure to wind and wet surfaces",
    },
    {
      mode: "driving" as const,
      suitability: driving,
      note:
        driving >= 70
          ? "Driving conditions look manageable"
          : "Reduce speed and expect reduced traction or visibility",
    },
    {
      mode: "transit" as const,
      suitability: transit,
      note:
        transit >= 70
          ? "Transit is a reliable option"
          : "Allow extra time for weather-related delays",
    },
  ].sort((a, b) => b.suitability - a.suitability);

  const top = modes[0];
  const advice = `Travel risk is ${risk} (${score}/100). Best option right now: ${top.mode} (${top.suitability}/100).`;

  return { score, risk, modes, advice };
}
