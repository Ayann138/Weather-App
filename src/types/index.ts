import type { ReactNode } from "react";

export type DashboardCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  footer?: string;
  className?: string;
  index?: number;
};

export type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
};

export type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export type HeaderProps = {
  title?: string;
  className?: string;
};

export type ThemeToggleProps = {
  className?: string;
};

export type {
  GetWeatherParams,
  WeatherUnits,
  CurrentWeather,
  HourlyWeather,
  DailyWeather,
  WeatherResponse,
  WeatherApiErrorResponse,
  WeatherMetricId,
  WeatherMetricItem,
} from "@/types/weather";

export type {
  SelectedLocation,
  LocationSearchProps,
  NominatimSearchResult,
  NominatimAddress,
} from "@/types/location";
