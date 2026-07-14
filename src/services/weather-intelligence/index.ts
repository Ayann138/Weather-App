import type { WeatherResponse } from "@/types/weather";

import {
  adviseActivities,
  type ActivityAdvice,
} from "./activityAdvisor";
import {
  adviseClothing,
  type ClothingAdvice,
} from "./clothingAdvisor";
import {
  calculateComfortScore,
  type ComfortScoreResult,
} from "./comfortScore";
import {
  adviseHydration,
  type HydrationAdvice,
} from "./hydrationAdvisor";
import {
  calculateOutdoorTime,
  type OutdoorTimeResult,
} from "./outdoorTime";
import { buildDayPlanner, type PlannerResult } from "./planner";
import { adviseTravel, type TravelAdvice } from "./travelAdvisor";
import {
  calculateWeatherScore,
  type WeatherScoreResult,
} from "./weatherScore";

export type WeatherIntelligence = {
  weatherScore: WeatherScoreResult;
  comfortScore: ComfortScoreResult;
  hydration: HydrationAdvice;
  clothing: ClothingAdvice;
  travel: TravelAdvice;
  activities: ActivityAdvice;
  planner: PlannerResult;
  outdoorTime: OutdoorTimeResult;
};

export function analyzeWeather(
  weather: WeatherResponse
): WeatherIntelligence {
  return {
    weatherScore: calculateWeatherScore(weather),
    comfortScore: calculateComfortScore(weather),
    hydration: adviseHydration(weather),
    clothing: adviseClothing(weather),
    travel: adviseTravel(weather),
    activities: adviseActivities(weather),
    planner: buildDayPlanner(weather),
    outdoorTime: calculateOutdoorTime(weather),
  };
}

export {
  calculateWeatherScore,
  calculateComfortScore,
  adviseHydration,
  adviseClothing,
  adviseTravel,
  adviseActivities,
  buildDayPlanner,
  calculateOutdoorTime,
};

export type {
  WeatherScoreResult,
  ComfortScoreResult,
  HydrationAdvice,
  ClothingAdvice,
  TravelAdvice,
  ActivityAdvice,
  PlannerResult,
  OutdoorTimeResult,
};
