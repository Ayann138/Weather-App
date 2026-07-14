"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ThemeToggleProps } from "@/types";

const themes = ["system", "light", "dark"] as const;

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = themes.includes(theme as (typeof themes)[number])
    ? (theme as (typeof themes)[number])
    : "system";

  const nextTheme =
    themes[(themes.indexOf(currentTheme) + 1) % themes.length];

  const label = {
    system: "System theme",
    light: "Light theme",
    dark: "Dark theme",
  }[currentTheme];

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={`Theme: ${label}. Click to switch to ${nextTheme}.`}
      title={`${label} · Click for ${nextTheme}`}
      className={cn("size-9", className)}
      onClick={() => setTheme(nextTheme)}
      disabled={!mounted}
    >
      {!mounted || currentTheme === "system" ? (
        <Monitor className="size-4" />
      ) : currentTheme === "dark" ? (
        <Moon className="size-4" />
      ) : (
        <Sun className="size-4" />
      )}
    </Button>
  );
}
