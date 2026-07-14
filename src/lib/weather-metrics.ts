import { formatSunTime, getSunTimes } from "@/lib/sun-times";
import type {
  WeatherMetricItem,
  WeatherResponse,
  WeatherUnits,
} from "@/types/weather";

const COMPASS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;

function getOptionalNumber(...values: Array<number | undefined>): number | null {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }
  return null;
}

function getWindUnit(units: WeatherUnits): string {
  return units === "imperial" ? "mph" : "km/h";
}

function getVisibilityUnit(units: WeatherUnits): string {
  return units === "imperial" ? "mi" : "km";
}

function getCompassLabel(degrees: number): string {
  const index = Math.round((((degrees % 360) + 360) % 360) / 45) % 8;
  return COMPASS[index];
}

function getHumiditySubtitle(humidity: number): string {
  if (humidity < 30) return "Dry air";
  if (humidity < 60) return "Comfortable";
  if (humidity < 80) return "Humid";
  return "Very humid";
}

function getWindSubtitle(speed: number, direction: number, units: WeatherUnits): string {
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

function getPressureSubtitle(pressure: number): string {
  if (pressure < 1000) return "Low pressure";
  if (pressure < 1020) return "Steady";
  return "High pressure";
}

function getVisibilitySubtitle(visibilityKm: number): string {
  if (visibilityKm < 1) return "Very poor";
  if (visibilityKm < 4) return "Hazy";
  if (visibilityKm < 10) return "Clear enough";
  return "Excellent";
}

function getUvSubtitle(uv: number): string {
  if (uv < 3) return "Low";
  if (uv < 6) return "Moderate";
  if (uv < 8) return "High";
  if (uv < 11) return "Very high";
  return "Extreme";
}

function parseApiTime(value: string | undefined, fallback: Date): Date {
  if (!value) {
    return fallback;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

function formatMetricValue(value: number, digits = 0): string {
  return value.toFixed(digits);
}

/**
 * Builds the metrics grid model from a Weather AI response.
 * Uses optional API fields when present; derives sunrise/sunset from coordinates otherwise.
 */
export function buildWeatherMetrics(
  weather: WeatherResponse
): WeatherMetricItem[] {
  const { current, daily, units, lat, lon } = weather;
  const today = daily[0];

  const humidity = getOptionalNumber(current.humidity, today?.humidity);
  const pressure = getOptionalNumber(current.pressure, today?.pressure);
  const visibility = getOptionalNumber(current.visibility, today?.visibility);
  const uvIndex = getOptionalNumber(current.uv_index, today?.uv_index);

  const referenceDate = current.time.includes("T")
    ? new Date(current.time)
    : new Date(`${today?.date ?? current.time}T12:00:00`);

  const computedSun = getSunTimes(lat, lon, referenceDate);
  const sunrise = parseApiTime(current.sunrise ?? today?.sunrise, computedSun.sunrise);
  const sunset = parseApiTime(current.sunset ?? today?.sunset, computedSun.sunset);

  const visibilityDisplay =
    visibility === null
      ? null
      : units === "imperial"
        ? visibility * 0.621371
        : visibility;

  return [
    {
      id: "humidity",
      label: "Humidity",
      value: humidity === null ? "—" : formatMetricValue(humidity),
      unit: "%",
      subtitle: humidity === null ? "Not available" : getHumiditySubtitle(humidity),
    },
    {
      id: "wind",
      label: "Wind Speed",
      value: formatMetricValue(current.windspeed),
      unit: getWindUnit(units),
      subtitle: getWindSubtitle(current.windspeed, current.winddirection, units),
    },
    {
      id: "pressure",
      label: "Pressure",
      value: pressure === null ? "—" : formatMetricValue(pressure),
      unit: "hPa",
      subtitle: pressure === null ? "Not available" : getPressureSubtitle(pressure),
    },
    {
      id: "visibility",
      label: "Visibility",
      value:
        visibilityDisplay === null
          ? "—"
          : formatMetricValue(visibilityDisplay, visibilityDisplay < 10 ? 1 : 0),
      unit: getVisibilityUnit(units),
      subtitle:
        visibility === null
          ? "Not available"
          : getVisibilitySubtitle(visibility),
    },
    {
      id: "uv",
      label: "UV Index",
      value: uvIndex === null ? "—" : formatMetricValue(uvIndex, uvIndex % 1 === 0 ? 0 : 1),
      unit: "",
      subtitle: uvIndex === null ? "Not available" : getUvSubtitle(uvIndex),
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
