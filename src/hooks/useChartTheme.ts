"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export type ChartTheme = {
  foreground: string;
  muted: string;
  grid: string;
  tooltipBg: string;
  tooltipBorder: string;
  temperature: string;
  temperatureSecondary: string;
  rain: string;
  comfort: string;
};

const lightTheme: ChartTheme = {
  foreground: "oklch(0.25 0 0)",
  muted: "oklch(0.55 0 0)",
  grid: "oklch(0.9 0 0)",
  tooltipBg: "oklch(1 0 0)",
  tooltipBorder: "oklch(0.9 0 0)",
  temperature: "oklch(0.55 0.12 230)",
  temperatureSecondary: "oklch(0.65 0.1 200)",
  rain: "oklch(0.55 0.12 250)",
  comfort: "oklch(0.55 0.1 170)",
};

const darkTheme: ChartTheme = {
  foreground: "oklch(0.92 0 0)",
  muted: "oklch(0.7 0 0)",
  grid: "oklch(1 0 0 / 12%)",
  tooltipBg: "oklch(0.22 0 0)",
  tooltipBorder: "oklch(1 0 0 / 12%)",
  temperature: "oklch(0.75 0.1 220)",
  temperatureSecondary: "oklch(0.7 0.08 190)",
  rain: "oklch(0.72 0.12 250)",
  comfort: "oklch(0.75 0.1 165)",
};

export function useChartTheme(): ChartTheme {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return lightTheme;
  }

  return resolvedTheme === "dark" ? darkTheme : lightTheme;
}
