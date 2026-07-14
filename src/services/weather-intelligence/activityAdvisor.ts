import type { WeatherResponse } from "@/types/weather";

import {
  getConditionSeverity,
  getPrecipIntensity,
  getTodayPrecip,
  roundScore,
  toCelsius,
  toKmh,
} from "./utils";

export type ActivityAdvice = {
  recommended: Array<{
    activity: string;
    score: number;
    reason: string;
  }>;
  avoid: Array<{
    activity: string;
    reason: string;
  }>;
  advice: string;
};

type ActivityCandidate = {
  activity: string;
  score: number;
  reason: string;
};

export function adviseActivities(weather: WeatherResponse): ActivityAdvice {
  const tempC = toCelsius(weather.current.temperature, weather.units);
  const windKmh = toKmh(weather.current.windspeed, weather.units);
  const precip = getTodayPrecip(weather);
  const precipIntensity = getPrecipIntensity(precip);
  const severity = getConditionSeverity(weather.current.weathercode);
  const uv = weather.current.uv_index ?? weather.daily[0]?.uv_index ?? 0;

  const outdoorBase = roundScore(
    100 - severity * 50 - precipIntensity * 40 - Math.max(0, Math.abs(tempC - 21) * 2.2)
  );

  const candidates: ActivityCandidate[] = [
    {
      activity: "Neighborhood walk",
      score: roundScore(outdoorBase - Math.max(0, windKmh - 20) * 1.1),
      reason: `Fits current ${Math.round(tempC)}°C air and ${Math.round(severity * 100)}% sky disruption.`,
    },
    {
      activity: "Outdoor running",
      score: roundScore(
        outdoorBase -
          Math.max(0, windKmh - 15) * 1.4 -
          Math.max(0, tempC - 26) * 3 -
          Math.max(0, 5 - tempC) * 2
      ),
      reason: "Depends on cool, dry, low-wind intervals.",
    },
    {
      activity: "Cycling",
      score: roundScore(outdoorBase - windKmh * 1.1 - precipIntensity * 20),
      reason: "Sensitive to crosswinds and wet pavement.",
    },
    {
      activity: "Picnic / park time",
      score: roundScore(
        outdoorBase - precipIntensity * 25 - Math.max(0, uv - 7) * 4
      ),
      reason: "Needs mild temps and limited rain risk.",
    },
    {
      activity: "Indoor workout",
      score: roundScore(55 + severity * 30 + precipIntensity * 25),
      reason: "Rises in value when outdoor exposure is harsh.",
    },
    {
      activity: "Cafe / museum outing",
      score: roundScore(50 + severity * 25 + precipIntensity * 20),
      reason: "Strong fallback in unsettled weather.",
    },
    {
      activity: "Photography walk",
      score: roundScore(
        outdoorBase -
          precipIntensity * 15 +
          (weather.current.weathercode === 2 || weather.current.weathercode === 3
            ? 8
            : 0)
      ),
      reason: "Cloud texture can help; heavy rain hurts gear and comfort.",
    },
  ];

  const recommended = [...candidates]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const avoid = [...candidates]
    .filter((item) => item.score < 45)
    .sort((a, b) => a.score - b.score)
    .slice(0, 2)
    .map((item) => ({
      activity: item.activity,
      reason: item.reason,
    }));

  const advice = `Top activity fit: ${recommended[0]?.activity ?? "Indoor plans"} (${recommended[0]?.score ?? 0}/100).`;

  return { recommended, avoid, advice };
}
