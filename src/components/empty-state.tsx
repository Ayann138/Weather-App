"use client";

import { Inbox } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import type { EmptyStateProps } from "@/types";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/50 px-6 py-14 text-center sm:px-10 sm:py-16 dark:border-white/15 dark:bg-card/40",
        className
      )}
    >
      <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground sm:size-14 dark:bg-muted/70 [&_svg]:size-6 sm:[&_svg]:size-7">
        {icon ?? <Inbox aria-hidden />}
      </div>
      <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
        {title}
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </motion.div>
  );
}
