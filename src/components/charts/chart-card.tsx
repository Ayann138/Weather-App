"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export type ChartCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  index?: number;
};

export function ChartCard({
  title,
  description,
  children,
  className,
  index = 0,
}: ChartCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 + index * 0.06, ease: "easeOut" }}
      className={cn(
        "overflow-hidden rounded-2xl border border-border/60 bg-card/95 p-4 shadow-sm ring-1 ring-foreground/5 dark:border-white/10 dark:bg-card/80 dark:ring-white/8 sm:p-5",
        className
      )}
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
          {title}
        </h3>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="h-56 w-full sm:h-64">{children}</div>
    </motion.section>
  );
}
