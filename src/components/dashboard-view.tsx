"use client";

import { useState } from "react";
import { AlertCircle, CloudOff, RefreshCw } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { LocationSearch } from "@/components/location-search";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { WeatherResults } from "@/components/weather-results";
import { WeatherSkeleton } from "@/components/weather-skeleton";
import { useWeather } from "@/hooks/useWeather";
import type { SelectedLocation } from "@/types/location";

const FORECAST_DAYS = 7;

export function DashboardView() {
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);

  const { data, isLoading, isError, error, refetch } = useWeather({
    latitude: selectedLocation?.latitude ?? 0,
    longitude: selectedLocation?.longitude ?? 0,
    days: FORECAST_DAYS,
    enabled: selectedLocation !== null,
  });

  return (
    <div className="flex flex-col gap-12 sm:gap-14 lg:gap-16">
      <section className="flex flex-col gap-6 pt-2 sm:pt-6">
        <SectionHeading
          eyebrow="Dashboard"
          title="Welcome to Weather AI"
          description="Search a city to load live conditions, daily forecasts, and hourly outlooks."
        />

        <div className="max-w-xl">
          <LocationSearch
            onSelect={setSelectedLocation}
            placeholder="Search for a city to get weather..."
          />
        </div>
      </section>

      <section className="flex flex-col gap-5 sm:gap-6">
        <SectionHeading
          as="h2"
          title={
            selectedLocation
              ? `Weather in ${selectedLocation.name}`
              : "Live weather"
          }
          description={
            selectedLocation
              ? `${selectedLocation.country} · ${selectedLocation.latitude.toFixed(2)}, ${selectedLocation.longitude.toFixed(2)}`
              : "Pick a location to replace placeholders with live forecast data."
          }
        />

        {!selectedLocation ? (
          <EmptyState
            icon={<CloudOff aria-hidden />}
            title="No location selected"
            description="Search and select a city above to fetch current conditions and forecasts."
          />
        ) : null}

        {selectedLocation && isLoading ? <WeatherSkeleton /> : null}

        {selectedLocation && isError ? (
          <EmptyState
            icon={<AlertCircle aria-hidden />}
            title="Couldn't load weather"
            description={
              error?.message ??
              "Something went wrong while fetching weather for this location."
            }
            action={
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  void refetch();
                }}
              >
                <RefreshCw data-icon="inline-start" />
                Try again
              </Button>
            }
          />
        ) : null}

        {selectedLocation && !isLoading && !isError && data ? (
          <WeatherResults location={selectedLocation} weather={data} />
        ) : null}
      </section>
    </div>
  );
}
