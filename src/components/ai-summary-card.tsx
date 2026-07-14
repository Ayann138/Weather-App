"use client";

import { useState } from "react";
import { Bot, Check, Copy, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AiSummaryCardProps = {
  summary: string | null;
  generatedAt: string;
  locationName: string;
  className?: string;
};

export function AiSummaryCard({
  summary,
  generatedAt,
  locationName,
  className,
}: AiSummaryCardProps) {
  const [copied, setCopied] = useState(false);

  const timestamp = formatSummaryTimestamp(generatedAt);
  const text =
    summary?.trim() ||
    `Weather AI did not return a narrative summary for ${locationName}. Scores and advisors below are still computed from the live forecast.`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] p-[1px] shadow-[0_24px_60px_-28px_rgba(20,60,90,0.45)] sm:rounded-[2rem]",
        className
      )}
      aria-label="Weather AI summary"
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#3d8fd1_0%,#5eb0a8_42%,#7ec8e8_72%,#b7dff5_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_45%)]" />

      <div className="relative overflow-hidden rounded-[calc(1.75rem-1px)] bg-[linear-gradient(160deg,rgba(255,255,255,0.22),rgba(255,255,255,0.08))] px-5 py-6 text-white backdrop-blur-md sm:rounded-[calc(2rem-1px)] sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute -top-16 -right-10 size-44 rounded-full bg-white/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 size-52 rounded-full bg-sky-950/20 blur-3xl" />

        <div className="relative flex flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-white/20 shadow-inner ring-1 ring-white/30 sm:size-14">
                <Bot className="size-6 sm:size-7" aria-hidden />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold tracking-[0.16em] text-white/80 uppercase">
                    Weather Intelligence
                  </p>
                  <Sparkles className="size-3.5 text-white/80" aria-hidden />
                </div>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                  AI Summary
                </h2>
                <p className="mt-1 text-sm text-white/75">
                  Centerpiece briefing for {locationName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start">
              <p className="text-xs text-white/70 sm:text-sm">{timestamp}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  void handleCopy();
                }}
                className="border-white/25 bg-white/15 text-white hover:bg-white/25 hover:text-white"
                aria-label={copied ? "Summary copied" : "Copy AI summary"}
              >
                {copied ? (
                  <Check data-icon="inline-start" />
                ) : (
                  <Copy data-icon="inline-start" />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>

          <p className="max-w-3xl text-base leading-relaxed text-white/95 sm:text-lg md:text-xl md:leading-relaxed">
            {text}
          </p>

          {!summary?.trim() ? (
            <p className="text-xs text-white/65 sm:text-sm">
              Tip: AI narrative requires `ai=true` from Weather AI. Local
              intelligence scores still update from forecast physics.
            </p>
          ) : null}
        </div>
      </div>
    </motion.section>
  );
}

function formatSummaryTimestamp(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}
