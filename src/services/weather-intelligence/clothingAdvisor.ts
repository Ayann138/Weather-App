import type { WeatherResponse } from "@/types/weather";

import {
  getConditionSeverity,
  getTodayPrecip,
  getTodayRange,
  toCelsius,
  toKmh,
} from "./utils";

export type ClothingAdvice = {
  layers: string[];
  accessories: string[];
  footwear: string;
  advice: string;
};

export function adviseClothing(weather: WeatherResponse): ClothingAdvice {
  const tempC = toCelsius(weather.current.temperature, weather.units);
  const range = getTodayRange(weather);
  const windKmh = toKmh(weather.current.windspeed, weather.units);
  const precip = getTodayPrecip(weather);
  const severity = getConditionSeverity(weather.current.weathercode);
  const swing = range.max - range.min;

  const layers: string[] = [];
  const accessories: string[] = [];

  if (tempC <= 0) {
    layers.push("Insulated base layer", "Heavy midlayer", "Winter coat");
  } else if (tempC <= 8) {
    layers.push("Long-sleeve base", "Fleece or sweater", "Insulated jacket");
  } else if (tempC <= 14) {
    layers.push("Long-sleeve top", "Light jacket");
  } else if (tempC <= 20) {
    layers.push("Breathable shirt", "Optional light layer");
  } else if (tempC <= 27) {
    layers.push("Lightweight short sleeves");
  } else {
    layers.push("Ultralight breathable top", "Sun-protective fabric");
  }

  if (swing >= 10) {
    layers.push("Packable layer for temperature swing");
  }

  if (windKmh >= 20) {
    accessories.push("Wind-resistant shell");
  }

  if (precip >= 0.5 || severity >= 0.4) {
    accessories.push("Water-resistant outer layer");
  }

  if (tempC >= 24 || (weather.current.uv_index ?? 0) >= 6) {
    accessories.push("Hat or cap", "Sunglasses");
  }

  if (tempC <= 5) {
    accessories.push("Gloves", "Warm beanie");
  }

  let footwear = "Everyday sneakers";
  if (precip >= 2 || severity >= 0.55) {
    footwear = "Waterproof shoes or boots";
  } else if (tempC <= 2) {
    footwear = "Insulated closed shoes";
  } else if (tempC >= 28) {
    footwear = "Breathable sneakers or sandals with support";
  }

  const advice = `Dress for ${Math.round(range.min)}–${Math.round(range.max)}°C with ${layers.length} layer recommendation${layers.length === 1 ? "" : "s"} and ${accessories.length} accessory cue${accessories.length === 1 ? "" : "s"}.`;

  return {
    layers,
    accessories,
    footwear,
    advice,
  };
}
