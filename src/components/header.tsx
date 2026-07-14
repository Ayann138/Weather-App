"use client";

import { CloudSun } from "lucide-react";
import { motion } from "framer-motion";

import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import type { HeaderProps } from "@/types";

export function Header({
  title = "Weather AI App",
  className,
}: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md dark:border-border/40 dark:bg-background/70",
        className
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm sm:size-9">
            <CloudSun className="size-4 sm:size-[1.125rem]" aria-hidden />
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
            {title}
          </span>
        </div>

        <ThemeToggle />
      </div>
    </motion.header>
  );
}
