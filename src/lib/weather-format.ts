/** WMO weather interpretation codes (Open-Meteo style). */
const WEATHER_CODE_LABELS: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

export function getWeatherLabel(weathercode: number): string {
  return WEATHER_CODE_LABELS[weathercode] ?? `Weather code ${weathercode}`;
}

export function formatTemperature(value: number, units: "metric" | "imperial" = "metric"): string {
  const unit = units === "imperial" ? "°F" : "°C";
  return `${Math.round(value)}${unit}`;
}

export function formatWindSpeed(value: number, units: "metric" | "imperial" = "metric"): string {
  const unit = units === "imperial" ? "mph" : "km/h";
  return `${Math.round(value)} ${unit}`;
}

export function formatPrecipitation(value: number): string {
  return `${value.toFixed(value > 0 && value < 1 ? 1 : 0)} mm`;
}

export function formatDayLabel(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(parsed);
}

export function formatHourLabel(time: string): string {
  const parsed = new Date(time);
  if (Number.isNaN(parsed.getTime())) {
    return time;
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
  }).format(parsed);
}
