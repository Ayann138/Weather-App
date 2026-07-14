import type { WeatherResponse } from "@/types/weather";

import {
  getConditionSeverity,
  getPrecipIntensity,
  roundScore,
  toCelsius,
} from "./utils";

export type PlannerBlock = {
  period: "morning" | "afternoon" | "evening";
  label: string;
  score: number;
  focus: string;
  detail: string;
};

export type PlannerResult = {
  blocks: PlannerBlock[];
  bestPeriod: PlannerBlock["period"];
  advice: string;
};

function getPeriodHours(period: PlannerBlock["period"]): number[] {
  if (period === "morning") return [6, 7, 8, 9, 10, 11];
  if (period === "afternoon") return [12, 13, 14, 15, 16, 17];
  return [18, 19, 20, 21];
}

function scorePeriod(
  weather: WeatherResponse,
  period: PlannerBlock["period"]
): { score: number; avgTemp: number; avgPrecip: number; avgSeverity: number } {
  const hours = getPeriodHours(period);
  const slices = weather.hourly.filter((hour) => {
    const hourOfDay = new Date(hour.time).getHours();
    return hours.includes(hourOfDay);
  });

  if (slices.length === 0) {
    const tempC = toCelsius(weather.current.temperature, weather.units);
    const severity = getConditionSeverity(weather.current.weathercode);
    return {
      score: roundScore(70 - severity * 40),
      avgTemp: tempC,
      avgPrecip: weather.daily[0]?.precipitation ?? 0,
      avgSeverity: severity,
    };
  }

  const avgTemp =
    slices.reduce(
      (sum, hour) => sum + toCelsius(hour.temp, weather.units),
      0
    ) / slices.length;
  const avgPrecip =
    slices.reduce((sum, hour) => sum + hour.precipitation, 0) / slices.length;
  const avgSeverity =
    slices.reduce(
      (sum, hour) => sum + getConditionSeverity(hour.weathercode),
      0
    ) / slices.length;

  const score = roundScore(
    100 -
      avgSeverity * 45 -
      getPrecipIntensity(avgPrecip) * 30 -
      Math.abs(avgTemp - 21) * 2
  );

  return { score, avgTemp, avgPrecip, avgSeverity };
}

function buildFocus(
  period: PlannerBlock["period"],
  score: number,
  avgPrecip: number,
  avgSeverity: number
): { focus: string; detail: string; label: string } {
  const label =
    period === "morning"
      ? "Morning"
      : period === "afternoon"
        ? "Afternoon"
        : "Evening";

  if (score >= 75 && avgPrecip < 0.5 && avgSeverity < 0.35) {
    return {
      label,
      focus: "Prime outdoor window",
      detail: `${label} looks favorable for errands, walks, and open-air plans.`,
    };
  }

  if (score >= 55) {
    return {
      label,
      focus: "Flexible outdoor / indoor mix",
      detail: `${label} works with short outdoor blocks and a covered backup.`,
    };
  }

  return {
    label,
    focus: "Favor indoor plans",
    detail: `${label} carries higher weather friction — keep key tasks sheltered.`,
  };
}

export function buildDayPlanner(weather: WeatherResponse): PlannerResult {
  const periods: PlannerBlock["period"][] = ["morning", "afternoon", "evening"];

  const blocks = periods.map((period) => {
    const scored = scorePeriod(weather, period);
    const copy = buildFocus(
      period,
      scored.score,
      scored.avgPrecip,
      scored.avgSeverity
    );

    return {
      period,
      label: copy.label,
      score: scored.score,
      focus: copy.focus,
      detail: copy.detail,
    };
  });

  const best = [...blocks].sort((a, b) => b.score - a.score)[0];

  return {
    blocks,
    bestPeriod: best.period,
    advice: `Best part of the day: ${best.label.toLowerCase()} (${best.score}/100) — ${best.focus.toLowerCase()}.`,
  };
}
