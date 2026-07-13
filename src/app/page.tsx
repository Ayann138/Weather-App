import { Cloud, MapPin, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-10">
      <section className="space-y-4 pt-4 sm:pt-8">
        <p className="text-sm font-medium text-muted-foreground">Dashboard</p>
        <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Welcome to Weather AI
        </h1>

      </section>

    </div>
  );
}
