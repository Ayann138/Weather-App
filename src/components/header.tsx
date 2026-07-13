import { CloudSun, Moon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <CloudSun className="size-4" aria-hidden />
          </span>
          <span className="text-sm font-semibold tracking-tight sm:text-base">
            Weather AI App
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Toggle theme (coming soon)"
          title="Theme toggle coming soon"
          disabled
        >
          <Moon className="size-4" />
        </Button>
      </div>
    </header>
  );
}
