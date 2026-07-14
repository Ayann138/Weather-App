export type WeatherUnits = "metric" | "imperial";

export interface GetWeatherParams {
  latitude: number;
  longitude: number;
  days?: number;
  ai?: boolean;
  units?: WeatherUnits;
  lang?: string;
}

export interface CurrentWeather {
  time: string;
  interval: number;
  temperature: number;
  windspeed: number;
  winddirection: number;
  is_day: 0 | 1;
  weathercode: number;
  /** Optional fields when provided by Weather AI */
  humidity?: number;
  pressure?: number;
  visibility?: number;
  uv_index?: number;
  sunrise?: string;
  sunset?: string;
}

export interface DailyWeather {
  date: string;
  temp_max: number;
  temp_min: number;
  precipitation: number;
  weathercode: number;
  /** Optional fields when provided by Weather AI */
  humidity?: number;
  pressure?: number;
  visibility?: number;
  uv_index?: number;
  sunrise?: string;
  sunset?: string;
  windspeed?: number;
}

export interface HourlyWeather {
  time: string;
  temp: number;
  precipitation: number;
  weathercode: number;
  humidity?: number;
  pressure?: number;
  visibility?: number;
  uv_index?: number;
  windspeed?: number;
}

export interface WeatherResponse {
  lat: number;
  lon: number;
  units: WeatherUnits;
  days: number;
  current: CurrentWeather;
  daily: DailyWeather[];
  hourly: HourlyWeather[];
  ai_summary: string | null;
}

export interface WeatherApiErrorResponse {
  message?: string;
  error?: string;
  code?: string;
  details?: unknown;
}

export type WeatherMetricId = "wind" | "sunrise" | "sunset";

export type WeatherMetricItem = {
  id: WeatherMetricId;
  label: string;
  value: string;
  unit: string;
  subtitle: string;
};
