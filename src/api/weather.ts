import { isAxiosError } from "axios";

import { WeatherApiError } from "@/lib/api-error";
import { weatherApi } from "@/lib/axios";
import type {
  CurrentWeather,
  DailyWeather,
  GetWeatherParams,
  HourlyWeather,
  WeatherApiErrorResponse,
  WeatherResponse,
  WeatherUnits,
} from "@/types/weather";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isWeatherUnits(value: unknown): value is WeatherUnits {
  return value === "metric" || value === "imperial";
}

function isCurrentWeather(value: unknown): value is CurrentWeather {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.time === "string" &&
    isNumber(value.interval) &&
    isNumber(value.temperature) &&
    isNumber(value.windspeed) &&
    isNumber(value.winddirection) &&
    (value.is_day === 0 || value.is_day === 1) &&
    isNumber(value.weathercode)
  );
}

function isDailyWeather(value: unknown): value is DailyWeather {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.date === "string" &&
    isNumber(value.temp_max) &&
    isNumber(value.temp_min) &&
    isNumber(value.precipitation) &&
    isNumber(value.weathercode)
  );
}

function isHourlyWeather(value: unknown): value is HourlyWeather {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.time === "string" &&
    isNumber(value.temp) &&
    isNumber(value.precipitation) &&
    isNumber(value.weathercode)
  );
}

function isWeatherResponse(value: unknown): value is WeatherResponse {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isNumber(value.lat) &&
    isNumber(value.lon) &&
    isWeatherUnits(value.units) &&
    isNumber(value.days) &&
    isCurrentWeather(value.current) &&
    Array.isArray(value.daily) &&
    value.daily.every(isDailyWeather) &&
    Array.isArray(value.hourly) &&
    value.hourly.every(isHourlyWeather) &&
    (typeof value.ai_summary === "string" || value.ai_summary === null)
  );
}

function getApiErrorMessage(data: unknown, fallback: string): string {
  if (!isRecord(data)) {
    return fallback;
  }

  const errorBody = data as WeatherApiErrorResponse;

  if (typeof errorBody.message === "string" && errorBody.message.length > 0) {
    return errorBody.message;
  }

  if (typeof errorBody.error === "string" && errorBody.error.length > 0) {
    return errorBody.error;
  }

  return fallback;
}

function handleWeatherRequestError(error: unknown): never {
  if (error instanceof WeatherApiError) {
    throw error;
  }

  if (isAxiosError(error)) {
    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      throw new WeatherApiError(
        "Unable to reach the Weather AI API. Check your network connection and try again.",
        {
          code: "NETWORK_ERROR",
          cause: error,
        }
      );
    }

    if (error.code === "ECONNABORTED") {
      throw new WeatherApiError("The Weather AI API request timed out.", {
        code: "TIMEOUT",
        cause: error,
      });
    }

    const status = error.response?.status;
    const message = getApiErrorMessage(
      error.response?.data,
      status
        ? `Weather AI API request failed with status ${status}.`
        : "Weather AI API request failed."
    );

    throw new WeatherApiError(message, {
      status,
      code: status ? `HTTP_${status}` : "API_ERROR",
      details: error.response?.data,
      cause: error,
    });
  }

  throw new WeatherApiError(
    "An unexpected error occurred while fetching weather data.",
    {
      code: "UNKNOWN_ERROR",
      cause: error,
    }
  );
}

/**
 * Fetches current conditions, hourly/daily forecasts, and optional AI summary.
 *
 * Maps `latitude`/`longitude` to the API's `lat`/`lon` query params.
 */
export async function getWeather({
  latitude,
  longitude,
  days = 7,
  ai = true,
  units = "metric",
  lang,
}: GetWeatherParams): Promise<WeatherResponse> {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new WeatherApiError("Latitude and longitude must be valid numbers.", {
      code: "INVALID_PARAMS",
    });
  }

  if (!Number.isInteger(days) || days < 1) {
    throw new WeatherApiError(
      "Days must be an integer greater than or equal to 1.",
      {
        code: "INVALID_PARAMS",
      }
    );
  }

  try {
    const { data } = await weatherApi.get<unknown>("/weather/forecast", {
      params: {
        lat: latitude,
        lon: longitude,
        days,
        ai,
        units,
        ...(lang ? { lang } : {}),
      },
    });

    if (!isWeatherResponse(data)) {
      throw new WeatherApiError(
        "Received an invalid response from the Weather AI API.",
        {
          code: "INVALID_RESPONSE",
          details: data,
        }
      );
    }

    return data;
  } catch (error) {
    handleWeatherRequestError(error);
  }
}

export function getCurrentWeather(response: WeatherResponse): CurrentWeather {
  return response.current;
}

export function getHourlyForecast(response: WeatherResponse): HourlyWeather[] {
  return response.hourly;
}

export function getDailyForecast(response: WeatherResponse): DailyWeather[] {
  return response.daily;
}

export function getAiSummary(response: WeatherResponse): string | null {
  return response.ai_summary;
}
