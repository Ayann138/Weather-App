import type { LucideIcon } from "lucide-react";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
} from "lucide-react";

export function getWeatherIcon(
  weathercode: number,
  isDay: 0 | 1 = 1
): LucideIcon {
  if (weathercode === 0) {
    return isDay === 1 ? Sun : Moon;
  }

  if (weathercode === 1 || weathercode === 2) {
    return isDay === 1 ? CloudSun : Cloud;
  }

  if (weathercode === 3) {
    return Cloud;
  }

  if (weathercode === 45 || weathercode === 48) {
    return CloudFog;
  }

  if (
    weathercode === 51 ||
    weathercode === 53 ||
    weathercode === 55 ||
    weathercode === 56 ||
    weathercode === 57
  ) {
    return CloudDrizzle;
  }

  if (
    weathercode === 61 ||
    weathercode === 63 ||
    weathercode === 65 ||
    weathercode === 66 ||
    weathercode === 67 ||
    weathercode === 80 ||
    weathercode === 81 ||
    weathercode === 82
  ) {
    return CloudRain;
  }

  if (
    weathercode === 71 ||
    weathercode === 73 ||
    weathercode === 75 ||
    weathercode === 77 ||
    weathercode === 85 ||
    weathercode === 86
  ) {
    return CloudSnow;
  }

  if (weathercode === 95 || weathercode === 96 || weathercode === 99) {
    return CloudLightning;
  }

  return isDay === 1 ? CloudSun : Cloud;
}

/**
 * Estimates apparent temperature from the fields the Weather AI API returns
 * (air temperature + wind speed).
 */
export function estimateFeelsLike(
  temperature: number,
  windspeedKmh: number
): number {
  const wind = Math.max(windspeedKmh, 0);

  if (temperature <= 10 && wind >= 5) {
    const windPow = wind ** 0.16;
    return (
      13.12 +
      0.6215 * temperature -
      11.37 * windPow +
      0.3965 * temperature * windPow
    );
  }

  if (temperature >= 27) {
    return temperature + Math.min(wind * 0.05, 1.5);
  }

  return temperature - Math.min(wind * 0.03, 1.2);
}

export function getHeroAtmosphere(isDay: 0 | 1, weathercode: number): string {
  const isStormy =
    weathercode >= 61 ||
    weathercode === 95 ||
    weathercode === 96 ||
    weathercode === 99;
  const isOvercast = weathercode === 3 || weathercode === 45 || weathercode === 48;

  if (isDay === 0) {
    if (isStormy) {
      return "from-[#1b2438] via-[#243055] to-[#3a4a6b]";
    }
    return "from-[#0f1c3f] via-[#1a2b5c] to-[#3d5a8a]";
  }

  if (isStormy) {
    return "from-[#4a6078] via-[#6b7f93] to-[#8fa0b0]";
  }

  if (isOvercast) {
    return "from-[#7f92a8] via-[#9aaabe] to-[#b7c4d4]";
  }

  if (weathercode === 0 || weathercode === 1) {
    return "from-[#4fa3e8] via-[#6bb7f0] to-[#a8d4f7]";
  }

  return "from-[#5aa7e2] via-[#7ebcec] to-[#b3d7f5]";
}

export function formatFullDate(dateLike: string): string {
  const withTime = dateLike.includes("T")
    ? dateLike
    : `${dateLike}T12:00:00`;
  const parsed = new Date(withTime);

  if (Number.isNaN(parsed.getTime())) {
    return dateLike;
  }

  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(parsed);
}
