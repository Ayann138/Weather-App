export {
  searchCities,
  mapNominatimResult,
  GeocodingError,
} from "@/services/geocoding";

export {
  analyzeWeather,
  calculateWeatherScore,
  calculateComfortScore,
  adviseHydration,
  adviseClothing,
  adviseTravel,
  adviseActivities,
  buildDayPlanner,
  calculateOutdoorTime,
} from "@/services/weather-intelligence";

export type { WeatherIntelligence } from "@/services/weather-intelligence";
