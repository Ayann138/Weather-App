"use client";

import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DashboardCardProps } from "@/types";

export function DashboardCard({
  title,
  description,
  icon,
  footer = "Coming soon",
  className,
  index = 0,
}: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
        delay: 0.12 + index * 0.08,
      }}
      whileHover={{ y: -3 }}
      className="h-full"
    >
      <Card
        className={cn(
          "h-full border-transparent bg-card/90 shadow-sm ring-1 ring-foreground/8 transition-[box-shadow,background-color,ring-color] duration-300 hover:shadow-md hover:ring-foreground/12 dark:bg-card/70 dark:ring-white/10 dark:hover:bg-card/85 dark:hover:ring-white/16 dark:hover:shadow-black/30",
          className
        )}
      >
        <CardHeader className="gap-2">
          <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-muted text-foreground dark:bg-muted/80 [&_svg]:size-5">
            {icon}
          </div>
          <CardTitle className="text-base font-semibold sm:text-lg">
            {title}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed sm:text-[0.9375rem]">
            {description}
          </CardDescription>
        </CardHeader>
        {footer ? (
          <CardContent>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {footer}
            </p>
          </CardContent>
        ) : null}
      </Card>
    </motion.div>
  );
}
