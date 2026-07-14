"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  CalendarClock,
  Droplets,
  Shirt,
  Sparkles,
  Sun,
  ThermometerSun,
  TrainFront,
} from "lucide-react";

import type { WeatherIntelligence } from "@/services/weather-intelligence";
import { cn } from "@/lib/utils";

export type WeatherIntelligencePanelProps = {
  intelligence: WeatherIntelligence;
  className?: string;
};

export function WeatherIntelligencePanel({
  intelligence,
  className,
}: WeatherIntelligencePanelProps) {
  const {
    weatherScore,
    comfortScore,
    hydration,
    clothing,
    travel,
    activities,
    planner,
    outdoorTime,
  } = intelligence;

  return (
    <section
      aria-label="Weather intelligence engine"
      className={cn("flex flex-col gap-4 sm:gap-5", className)}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ScoreTile
          index={0}
          icon={<Sparkles className="size-4" aria-hidden />}
          label="Weather score"
          value={`${weatherScore.score}`}
          unit="/100"
          subtitle={weatherScore.label}
        />
        <ScoreTile
          index={1}
          icon={<ThermometerSun className="size-4" aria-hidden />}
          label="Comfort score"
          value={`${comfortScore.score}`}
          unit="/100"
          subtitle={comfortScore.label}
        />
        <ScoreTile
          index={2}
          icon={<Droplets className="size-4" aria-hidden />}
          label="Hydration"
          value={`${hydration.liters.toFixed(1)}`}
          unit="L"
          subtitle={hydration.level}
        />
        <ScoreTile
          index={3}
          icon={<Sun className="size-4" aria-hidden />}
          label="Outdoor time"
          value={`${outdoorTime.totalHours}`}
          unit="hrs"
          subtitle={outdoorTime.windows[0]?.label ?? "Limited windows"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <InfoCard
          index={0}
          icon={<Shirt className="size-4" aria-hidden />}
          title="Clothing advisor"
          body={clothing.advice}
        >
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            {clothing.layers.map((layer) => (
              <li key={layer}>• {layer}</li>
            ))}
            <li className="pt-1 text-foreground/90">Footwear: {clothing.footwear}</li>
          </ul>
        </InfoCard>

        <InfoCard
          index={1}
          icon={<TrainFront className="size-4" aria-hidden />}
          title="Travel advisor"
          body={travel.advice}
        >
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            {travel.modes.slice(0, 3).map((mode) => (
              <li key={mode.mode}>
                • {mode.mode}: {mode.suitability}/100 — {mode.note}
              </li>
            ))}
          </ul>
        </InfoCard>

        <InfoCard
          index={2}
          icon={<Activity className="size-4" aria-hidden />}
          title="Activity advisor"
          body={activities.advice}
        >
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            {activities.recommended.map((item) => (
              <li key={item.activity}>
                • {item.activity} ({item.score}/100)
              </li>
            ))}
          </ul>
        </InfoCard>

        <InfoCard
          index={3}
          icon={<CalendarClock className="size-4" aria-hidden />}
          title="Day planner"
          body={planner.advice}
        >
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            {planner.blocks.map((block) => (
              <li key={block.period}>
                • {block.label}: {block.focus} ({block.score}/100)
              </li>
            ))}
          </ul>
        </InfoCard>
      </div>
    </section>
  );
}

function ScoreTile({
  icon,
  label,
  value,
  unit,
  subtitle,
  index,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  unit: string;
  subtitle: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.05, duration: 0.35 }}
      className="rounded-2xl bg-card/90 p-4 ring-1 ring-foreground/8 dark:bg-card/70 dark:ring-white/10"
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          {label}
        </p>
        <div className="flex size-8 items-center justify-center rounded-lg bg-muted dark:bg-muted/80">
          {icon}
        </div>
      </div>
      <p className="text-3xl font-semibold tracking-tight text-foreground">
        {value}
        <span className="ml-1 text-sm font-medium text-muted-foreground">
          {unit}
        </span>
      </p>
      <p className="mt-1 text-sm text-muted-foreground capitalize">{subtitle}</p>
    </motion.div>
  );
}

function InfoCard({
  icon,
  title,
  body,
  children,
  index,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  children: ReactNode;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 + index * 0.05, duration: 0.35 }}
      className="rounded-2xl bg-card/90 p-5 ring-1 ring-foreground/8 dark:bg-card/70 dark:ring-white/10"
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-muted dark:bg-muted/80">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
      {children}
    </motion.article>
  );
}
