import { formatDayLabel, formatHourLabel } from "@/lib/weather-format";
import {
  getConditionSeverity,
  getPrecipIntensity,
  roundScore,
  toCelsius,
  toKmh,
} from "@/services/weather-intelligence/utils";
import type { WeatherResponse, WeatherUnits } from "@/types/weather";

export type TemperaturePoint = {
  label: string;
  high: number;
  low: number;
  time: string;
};

export type RainPoint = {
  label: string;
  precipitation: number;
  time: string;
};

export type ComfortPoint = {
  label: string;
  comfort: number;
  temperature: number;
  time: string;
};

export function buildTemperatureSeries(
  weather: WeatherResponse
): TemperaturePoint[] {
  if (weather.daily.length > 0) {
    return weather.daily.map((day) => ({
      label: formatDayLabel(day.date),
      high: Math.round(day.temp_max * 10) / 10,
      low: Math.round(day.temp_min * 10) / 10,
      time: day.date,
    }));
  }

  return weather.hourly.slice(0, 24).map((hour) => ({
    label: formatHourLabel(hour.time),
    high: Math.round(hour.temp * 10) / 10,
    low: Math.round(hour.temp * 10) / 10,
    time: hour.time,
  }));
}

export function buildRainSeries(weather: WeatherResponse): RainPoint[] {
  if (weather.daily.some((day) => day.precipitation > 0) || weather.hourly.length === 0) {
    return weather.daily.map((day) => ({
      label: formatDayLabel(day.date),
      precipitation: Math.round(day.precipitation * 10) / 10,
      time: day.date,
    }));
  }

  return weather.hourly.slice(0, 24).map((hour) => ({
    label: formatHourLabel(hour.time),
    precipitation: Math.round(hour.precipitation * 10) / 10,
    time: hour.time,
  }));
}

function scoreHourComfort(
  temp: number,
  precipitation: number,
  weathercode: number,
  windspeed: number,
  units: WeatherUnits,
  humidity?: number
): number {
  const tempC = toCelsius(temp, units);
  const windKmh = toKmh(windspeed, units);
  const tempComfort = roundScore(100 - Math.abs(tempC - 22) * 5.5);
  const windComfort = roundScore(100 - Math.max(0, windKmh - 8) * 2.2);
  const humidityComfort =
    typeof humidity === "number"
      ? roundScore(100 - Math.abs(humidity - 45) * 1.4)
      : roundScore(100 - getConditionSeverity(weathercode) * 20);
  const skyComfort = roundScore(
    100 -
      getConditionSeverity(weathercode) * 55 -
      Math.min(25, getPrecipIntensity(precipitation) * 25)
  );

  return roundScore(
    tempComfort * 0.35 +
      windComfort * 0.25 +
      humidityComfort * 0.2 +
      skyComfort * 0.2
  );
}

export function buildComfortSeries(weather: WeatherResponse): ComfortPoint[] {
  const fallbackWind = weather.current.windspeed;

  const source =
    weather.hourly.length > 0
      ? weather.hourly.slice(0, 24)
      : weather.daily.map((day) => ({
          time: `${day.date}T12:00`,
          temp: (day.temp_max + day.temp_min) / 2,
          precipitation: day.precipitation,
          weathercode: day.weathercode,
          humidity: day.humidity,
          windspeed: day.windspeed ?? fallbackWind,
        }));

  return source.map((point) => {
    const label = point.time.includes("T")
      ? formatHourLabel(point.time)
      : formatDayLabel(point.time);

    return {
      label,
      time: point.time,
      temperature: Math.round(point.temp * 10) / 10,
      comfort: scoreHourComfort(
        point.temp,
        point.precipitation,
        point.weathercode,
        point.windspeed ?? fallbackWind,
        weather.units,
        point.humidity
      ),
    };
  });
}

export function getTemperatureUnit(units: WeatherUnits): string {
  return units === "imperial" ? "°F" : "°C";
}
