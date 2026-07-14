import type { WeatherResponse, WeatherUnits } from "@/types/weather";

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function roundScore(value: number): number {
  return Math.round(clamp(value, 0, 100));
}

export function toCelsius(temp: number, units: WeatherUnits): number {
  if (units === "imperial") {
    return ((temp - 32) * 5) / 9;
  }
  return temp;
}

export function toKmh(speed: number, units: WeatherUnits): number {
  if (units === "imperial") {
    return speed * 1.60934;
  }
  return speed;
}

/** 0 clear → 1 severe based on WMO weather codes. */
export function getConditionSeverity(weathercode: number): number {
  if (weathercode === 0) return 0;
  if (weathercode === 1) return 0.08;
  if (weathercode === 2) return 0.18;
  if (weathercode === 3) return 0.28;
  if (weathercode === 45 || weathercode === 48) return 0.45;
  if (weathercode >= 51 && weathercode <= 57) return 0.4 + (weathercode - 51) * 0.04;
  if (weathercode >= 61 && weathercode <= 67) return 0.55 + (weathercode - 61) * 0.05;
  if (weathercode >= 71 && weathercode <= 77) return 0.6 + (weathercode - 71) * 0.05;
  if (weathercode >= 80 && weathercode <= 82) return 0.65 + (weathercode - 80) * 0.1;
  if (weathercode >= 85 && weathercode <= 86) return 0.7 + (weathercode - 85) * 0.1;
  if (weathercode >= 95) return 0.92;
  return 0.35;
}

export function getPrecipIntensity(precipitation: number): number {
  if (precipitation <= 0) return 0;
  if (precipitation < 0.5) return 0.2;
  if (precipitation < 2) return 0.4;
  if (precipitation < 5) return 0.65;
  if (precipitation < 10) return 0.8;
  return 1;
}

export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function getDaylightHours(weather: WeatherResponse): HourlySlice[] {
  return weather.hourly.filter((hour) => {
    const hourOfDay = new Date(hour.time).getHours();
    return Number.isFinite(hourOfDay) && hourOfDay >= 6 && hourOfDay <= 20;
  });
}

export type HourlySlice = WeatherResponse["hourly"][number];

export function getTodayPrecip(weather: WeatherResponse): number {
  return weather.daily[0]?.precipitation ?? 0;
}

export function getTodayRange(weather: WeatherResponse): {
  min: number;
  max: number;
} {
  const today = weather.daily[0];
  if (!today) {
    const tempC = toCelsius(weather.current.temperature, weather.units);
    return { min: tempC, max: tempC };
  }

  return {
    min: toCelsius(today.temp_min, weather.units),
    max: toCelsius(today.temp_max, weather.units),
  };
}
