"use client";

import { cn } from "@/lib/utils";

type WeatherSkeletonProps = {
  className?: string;
};

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-muted/80 dark:bg-muted/50",
        className
      )}
    />
  );
}

export function WeatherSkeleton({ className }: WeatherSkeletonProps) {
  return (
    <div className={cn("flex flex-col gap-5 sm:gap-6", className)} aria-busy aria-live="polite">
      <span className="sr-only">Loading weather data</span>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl bg-card/90 p-4 ring-1 ring-foreground/8 dark:bg-card/70 dark:ring-white/10"
          >
            <SkeletonBlock className="mb-4 size-10 rounded-xl" />
            <SkeletonBlock className="mb-2 h-5 w-2/3" />
            <SkeletonBlock className="mb-4 h-4 w-full" />
            <SkeletonBlock className="h-3 w-1/3" />
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-card/90 p-4 ring-1 ring-foreground/8 dark:bg-card/70 dark:ring-white/10">
        <SkeletonBlock className="mb-4 h-5 w-40" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-card/90 p-4 ring-1 ring-foreground/8 dark:bg-card/70 dark:ring-white/10">
        <SkeletonBlock className="mb-4 h-5 w-36" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-24 w-20 shrink-0 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
