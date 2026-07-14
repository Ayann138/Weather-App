"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export type MissionInsightCardProps = {
  icon: ReactNode;
  title: string;
  recommendation: string;
  why: string;
  accent?: string;
  index?: number;
  className?: string;
};

export function MissionInsightCard({
  icon,
  title,
  recommendation,
  why,
  accent = "from-sky-500/10 to-transparent",
  index = 0,
  className,
}: MissionInsightCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.06 + index * 0.06,
      }}
      whileHover={{ y: -3 }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/95 p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] ring-1 ring-foreground/5 transition-shadow duration-300 hover:shadow-[0_24px_50px_-28px_rgba(15,23,42,0.55)] dark:border-white/10 dark:bg-card/80 dark:ring-white/8 sm:p-6",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-90",
          accent
        )}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent" />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.7rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            Insight
          </p>
          <h3 className="mt-1 text-base font-semibold tracking-tight text-foreground sm:text-lg">
            {title}
          </h3>
        </div>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background/70 text-foreground shadow-sm ring-1 ring-foreground/10 backdrop-blur-sm dark:bg-background/40 [&_svg]:size-4">
          {icon}
        </div>
      </div>

      <p className="relative mt-5 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
        {recommendation}
      </p>

      <div className="relative mt-auto pt-5">
        <p className="text-[0.7rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          Why?
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {why}
        </p>
      </div>
    </motion.article>
  );
}
