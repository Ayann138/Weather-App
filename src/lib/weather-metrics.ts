import { formatSunTime, getSunTimes } from "@/lib/sun-times";
import type {
  WeatherMetricItem,
  WeatherResponse,
  WeatherUnits,
} from "@/types/weather";

const COMPASS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;

function getWindUnit(units: WeatherUnits): string {
  return units === "imperial" ? "mph" : "km/h";
}

function getCompassLabel(degrees: number): string {
  const index = Math.round((((degrees % 360) + 360) % 360) / 45) % 8;
  return COMPASS[index];
}

function getWindSubtitle(
  speed: number,
  direction: number,
  units: WeatherUnits
): string {
  const compass = getCompassLabel(direction);
  const calmThreshold = units === "imperial" ? 3 : 5;

  if (speed < calmThreshold) {
    return `Calm · ${compass}`;
  }

  if (speed < (units === "imperial" ? 12 : 20)) {
    return `Light breeze · ${compass}`;
  }

  if (speed < (units === "imperial" ? 25 : 40)) {
    return `Moderate · ${compass}`;
  }

  return `Strong · ${compass}`;
}

function parseApiTime(value: string | undefined, fallback: Date): Date {
  if (!value) {
    return fallback;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

/**
 * Builds metrics from fields the Weather AI API actually returns,
 * plus sunrise/sunset (API or estimated from coordinates).
 */
export function buildWeatherMetrics(
  weather: WeatherResponse
): WeatherMetricItem[] {
  const { current, daily, units, lat, lon } = weather;
  const today = daily[0];

  const referenceDate = current.time.includes("T")
    ? new Date(current.time)
    : new Date(`${today?.date ?? current.time}T12:00:00`);

  const computedSun = getSunTimes(lat, lon, referenceDate);
  const sunrise = parseApiTime(
    current.sunrise ?? today?.sunrise,
    computedSun.sunrise
  );
  const sunset = parseApiTime(
    current.sunset ?? today?.sunset,
    computedSun.sunset
  );

  return [
    {
      id: "wind",
      label: "Wind Speed",
      value: current.windspeed.toFixed(0),
      unit: getWindUnit(units),
      subtitle: getWindSubtitle(
        current.windspeed,
        current.winddirection,
        units
      ),
    },
    {
      id: "sunrise",
      label: "Sunrise",
      value: formatSunTime(sunrise),
      unit: "",
      subtitle: current.sunrise || today?.sunrise ? "Today" : "Estimated",
    },
    {
      id: "sunset",
      label: "Sunset",
      value: formatSunTime(sunset),
      unit: "",
      subtitle: current.sunset || today?.sunset ? "Today" : "Estimated",
    },
  ];
}
