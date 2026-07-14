"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export type WeatherMetricCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  unit?: string;
  subtitle: string;
  className?: string;
  index?: number;
};

export function WeatherMetricCard({
  icon,
  label,
  value,
  unit,
  subtitle,
  className,
  index = 0,
}: WeatherMetricCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
        delay: 0.05 + index * 0.05,
      }}
      whileHover={{ y: -2 }}
      className={cn(
        "flex h-full flex-col rounded-2xl border border-transparent bg-card/90 p-4 shadow-sm ring-1 ring-foreground/8 transition-shadow duration-300 hover:shadow-md dark:bg-card/70 dark:ring-white/10 sm:p-5",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          {label}
        </p>
        <div className="flex size-9 items-center justify-center rounded-xl bg-muted text-foreground dark:bg-muted/80 [&_svg]:size-4">
          {icon}
        </div>
      </div>

      <div className="mt-auto flex items-baseline gap-1.5">
        <p className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {value}
        </p>
        {unit ? (
          <span className="text-sm font-medium text-muted-foreground">{unit}</span>
        ) : null}
      </div>

      <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
    </motion.article>
  );
}
