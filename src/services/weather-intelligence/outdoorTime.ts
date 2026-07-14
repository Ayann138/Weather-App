import type { WeatherResponse } from "@/types/weather";

import {
  getConditionSeverity,
  getPrecipIntensity,
  roundScore,
  toCelsius,
  toKmh,
} from "./utils";

export type OutdoorTimeWindow = {
  start: string;
  end: string;
  score: number;
  label: string;
};

export type OutdoorTimeResult = {
  totalHours: number;
  windows: OutdoorTimeWindow[];
  advice: string;
};

function scoreHour(
  tempC: number,
  precip: number,
  weathercode: number,
  windKmh: number
): number {
  return roundScore(
    100 -
      getConditionSeverity(weathercode) * 45 -
      getPrecipIntensity(precip) * 35 -
      Math.abs(tempC - 21) * 2.4 -
      Math.max(0, windKmh - 18) * 1.1
  );
}

export function calculateOutdoorTime(
  weather: WeatherResponse
): OutdoorTimeResult {
  const windKmh = toKmh(weather.current.windspeed, weather.units);

  const ranked = weather.hourly
    .map((hour) => {
      const tempC = toCelsius(hour.temp, weather.units);
      const score = scoreHour(
        tempC,
        hour.precipitation,
        hour.weathercode,
        hour.windspeed !== undefined
          ? toKmh(hour.windspeed, weather.units)
          : windKmh
      );

      return {
        time: hour.time,
        score,
      };
    })
    .filter((hour) => {
      const hourOfDay = new Date(hour.time).getHours();
      return hourOfDay >= 6 && hourOfDay <= 21;
    });

  const goodHours = ranked.filter((hour) => hour.score >= 60);
  const windows: OutdoorTimeWindow[] = [];

  let index = 0;
  while (index < goodHours.length) {
    const startIndex = index;
    let endIndex = index;

    while (
      endIndex + 1 < goodHours.length &&
      new Date(goodHours[endIndex + 1].time).getTime() -
        new Date(goodHours[endIndex].time).getTime() <=
        60 * 60 * 1000
    ) {
      endIndex += 1;
    }

    const slice = goodHours.slice(startIndex, endIndex + 1);
    const avgScore = roundScore(
      slice.reduce((sum, item) => sum + item.score, 0) / slice.length
    );

    windows.push({
      start: slice[0].time,
      end: slice[slice.length - 1].time,
      score: avgScore,
      label:
        avgScore >= 80
          ? "Excellent outdoor window"
          : avgScore >= 70
            ? "Good outdoor window"
            : "Acceptable outdoor window",
    });

    index = endIndex + 1;
  }

  const topWindows = [...windows]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const totalHours = goodHours.length;
  const advice =
    totalHours === 0
      ? "No strong outdoor window stands out in the next hours — keep plans flexible and mostly covered."
      : `About ${totalHours} hour${totalHours === 1 ? "" : "s"} look outdoor-friendly, with the best window scoring ${topWindows[0]?.score ?? 0}/100.`;

  return {
    totalHours,
    windows: topWindows,
    advice,
  };
}
