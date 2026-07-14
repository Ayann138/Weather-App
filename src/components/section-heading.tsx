"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import type { SectionHeadingProps } from "@/types";

const titleStyles = {
  h1: "text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.1]",
  h2: "text-xl font-semibold tracking-tight text-balance text-foreground sm:text-2xl",
  h3: "text-lg font-semibold tracking-tight text-balance text-foreground sm:text-xl",
} as const;

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = "left",
  as: Tag = "h1",
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "flex max-w-2xl flex-col gap-3 sm:gap-4",
        align === "center" && "mx-auto items-center text-center",
        className
      )}
    >
      {eyebrow ? (
        <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase sm:text-sm sm:tracking-[0.12em]">
          {eyebrow}
        </p>
      ) : null}
      <Tag className={titleStyles[Tag]}>{title}</Tag>
      {description ? (
        <p
          className={cn(
            "max-w-xl leading-relaxed text-pretty text-muted-foreground",
            Tag === "h1" ? "text-base sm:text-lg" : "text-sm sm:text-base"
          )}
        >
          {description}
        </p>
      ) : null}
    </motion.div>
  );
}
