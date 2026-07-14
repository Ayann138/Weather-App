"use client";

import {
  useQuery,
  type QueryObserverResult,
  type RefetchOptions,
} from "@tanstack/react-query";

import { getWeather } from "@/api/weather";
import { queryKeys } from "@/constants/queryKeys";
import type { WeatherApiError } from "@/lib/api-error";
import type { WeatherResponse } from "@/types/weather";

const STALE_TIME_MS = 5 * 60 * 1000;
const GC_TIME_MS = 10 * 60 * 1000;

export type UseWeatherParams = {
  latitude: number;
  longitude: number;
  days?: number;
  enabled?: boolean;
};

export type UseWeatherResult = {
  data: WeatherResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: WeatherApiError | null;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<WeatherResponse, WeatherApiError>>;
};

export function useWeather({
  latitude,
  longitude,
  days = 7,
  enabled = true,
}: UseWeatherParams): UseWeatherResult {
  const query = useQuery<WeatherResponse, WeatherApiError>({
    queryKey: queryKeys.weather.detail(latitude, longitude, days),
    queryFn: () => getWeather({ latitude, longitude, days, ai: true }),
    staleTime: STALE_TIME_MS,
    gcTime: GC_TIME_MS,
    retry: 2,
    refetchOnWindowFocus: false,
    enabled:
      enabled &&
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      Number.isInteger(days) &&
      days >= 1,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
