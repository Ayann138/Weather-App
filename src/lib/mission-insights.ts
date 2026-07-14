import { formatHourLabel, formatTemperature, formatWindSpeed, getWeatherLabel } from "@/lib/weather-format";
import type { WeatherIntelligence } from "@/services/weather-intelligence";
import { toCelsius, toKmh } from "@/services/weather-intelligence/utils";
import type { WeatherResponse } from "@/types/weather";

export type MissionInsightId =
  | "weather-score"
  | "outdoor-comfort"
  | "hydration"
  | "clothing"
  | "travel"
  | "outdoor-time"
  | "activity";

export type MissionInsight = {
  id: MissionInsightId;
  title: string;
  recommendation: string;
  why: string;
  accent: string;
};

export function buildMissionInsights(
  weather: WeatherResponse,
  intelligence: WeatherIntelligence
): MissionInsight[] {
  const tempC = toCelsius(weather.current.temperature, weather.units);
  const windKmh = toKmh(weather.current.windspeed, weather.units);
  const condition = getWeatherLabel(weather.current.weathercode);
  const precip = weather.daily[0]?.precipitation ?? 0;
  const today = weather.daily[0];
  const topActivity = intelligence.activities.recommended[0];
  const topTravel = intelligence.travel.modes[0];
  const bestWindow = intelligence.outdoorTime.windows[0];

  return [
    {
      id: "weather-score",
      title: "Weather Score",
      recommendation: `${intelligence.weatherScore.label} · ${intelligence.weatherScore.score}/100`,
      why: `Score reflects ${Math.round(tempC)}°C air, ${formatWindSpeed(weather.current.windspeed, weather.units)} wind, ${precip.toFixed(1)} mm precip, and ${condition.toLowerCase()} skies.`,
      accent: "from-sky-500/15 to-cyan-500/5",
    },
    {
      id: "outdoor-comfort",
      title: "Outdoor Comfort",
      recommendation: `${intelligence.comfortScore.label} · ${intelligence.comfortScore.score}/100`,
      why: `Comfort blends temperature (${intelligence.comfortScore.factors.temperature}/100), wind (${intelligence.comfortScore.factors.wind}/100), humidity (${intelligence.comfortScore.factors.humidity}/100), and sky quality (${intelligence.comfortScore.factors.sky}/100).`,
      accent: "from-teal-500/15 to-emerald-500/5",
    },
    {
      id: "hydration",
      title: "Hydration Advice",
      recommendation: `${intelligence.hydration.liters.toFixed(1)} L · every ${intelligence.hydration.intervalMinutes} min`,
      why:
        intelligence.hydration.reasons.length > 0
          ? intelligence.hydration.reasons.join(" · ")
          : `Fluid plan scales with ${Math.round(tempC)}°C conditions and outdoor exposure demand.`,
      accent: "from-blue-500/15 to-indigo-500/5",
    },
    {
      id: "clothing",
      title: "Clothing Recommendation",
      recommendation: `${intelligence.clothing.layers[0] ?? "Adaptive layers"} · ${intelligence.clothing.footwear}`,
      why: `Outfit targets a ${today ? `${Math.round(toCelsius(today.temp_min, weather.units))}–${Math.round(toCelsius(today.temp_max, weather.units))}°C` : `${Math.round(tempC)}°C`} day with ${formatWindSpeed(weather.current.windspeed, weather.units)} wind${precip > 0 ? ` and ${precip.toFixed(1)} mm rain risk` : ""}.`,
      accent: "from-amber-500/15 to-orange-500/5",
    },
    {
      id: "travel",
      title: "Travel Advice",
      recommendation: `${intelligence.travel.risk} risk · prefer ${topTravel?.mode ?? "transit"}`,
      why: topTravel
        ? `${topTravel.mode} leads at ${topTravel.suitability}/100 because ${topTravel.note.toLowerCase()} Current travel score is ${intelligence.travel.score}/100.`
        : intelligence.travel.advice,
      accent: "from-slate-500/15 to-zinc-500/5",
    },
    {
      id: "outdoor-time",
      title: "Best Outdoor Time",
      recommendation: bestWindow
        ? `${formatHourLabel(bestWindow.start)}–${formatHourLabel(bestWindow.end)} · ${bestWindow.score}/100`
        : `${intelligence.outdoorTime.totalHours} outdoor-friendly hour${intelligence.outdoorTime.totalHours === 1 ? "" : "s"}`,
      why: bestWindow
        ? `${bestWindow.label} based on hourly temp, precip, and sky quality between ${formatHourLabel(bestWindow.start)} and ${formatHourLabel(bestWindow.end)}.`
        : intelligence.outdoorTime.advice,
      accent: "from-lime-500/15 to-green-500/5",
    },
    {
      id: "activity",
      title: "Activity Recommendation",
      recommendation: topActivity
        ? `${topActivity.activity} · ${topActivity.score}/100`
        : "Favor indoor plans",
      why: topActivity
        ? `${topActivity.reason} Avoid list is driven by the same live metrics: ${formatTemperature(weather.current.temperature, weather.units)}, ${Math.round(windKmh)} km/h wind, and ${condition.toLowerCase()}.`
        : `No high-fit outdoor activity cleared the threshold under ${condition.toLowerCase()} and ${precip.toFixed(1)} mm precip.`,
      accent: "from-cyan-500/15 to-sky-500/5",
    },
  ];
}
