"use client";

import type { ReactNode } from "react";
import {
  Activity,
  Droplets,
  Gauge,
  Shirt,
  Sun,
  ThermometerSun,
  TrainFront,
} from "lucide-react";
import { motion } from "framer-motion";

import { MissionInsightCard } from "@/components/mission-insight-card";
import {
  buildMissionInsights,
  type MissionInsightId,
} from "@/lib/mission-insights";
import type { WeatherIntelligence } from "@/services/weather-intelligence";
import { cn } from "@/lib/utils";
import type { WeatherResponse } from "@/types/weather";

const INSIGHT_ICONS: Record<MissionInsightId, ReactNode> = {
  "weather-score": <Gauge aria-hidden />,
  "outdoor-comfort": <ThermometerSun aria-hidden />,
  hydration: <Droplets aria-hidden />,
  clothing: <Shirt aria-hidden />,
  travel: <TrainFront aria-hidden />,
  "outdoor-time": <Sun aria-hidden />,
  activity: <Activity aria-hidden />,
};

export type MissionControlInsightsProps = {
  weather: WeatherResponse;
  intelligence: WeatherIntelligence;
  className?: string;
};

export function MissionControlInsights({
  weather,
  intelligence,
  className,
}: MissionControlInsightsProps) {
  const insights = buildMissionInsights(weather, intelligence);

  return (
    <section
      aria-label="Insights"
      className={cn("flex flex-col gap-5 sm:gap-6", className)}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Insights
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Live operational guidance computed from current conditions, daily
            range, wind, and precipitation.
          </p>
        </div>
        <div className="rounded-full border border-border/70 bg-card/70 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm dark:border-white/10">
          {insights.length} active advisors
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {insights.map((insight, index) => (
          <MissionInsightCard
            key={insight.id}
            index={index}
            icon={INSIGHT_ICONS[insight.id]}
            title={insight.title}
            recommendation={insight.recommendation}
            why={insight.why}
            accent={insight.accent}
            className={
              insight.id === "activity"
                ? "sm:col-span-2 xl:col-span-1 2xl:col-span-1"
                : undefined
            }
          />
        ))}
      </div>
    </section>
  );
}
