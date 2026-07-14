import { NextResponse } from "next/server";

import { mapNominatimResult } from "@/services/geocoding";
import type { NominatimSearchResult } from "@/types/location";

const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const limit = searchParams.get("limit") ?? "6";

  if (query.length < 2) {
    return NextResponse.json([]);
  }

  const upstreamParams = new URLSearchParams({
    q: query,
    format: "json",
    addressdetails: "1",
    limit,
  });

  try {
    const upstream = await fetch(
      `${NOMINATIM_SEARCH_URL}?${upstreamParams.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "WeatherAIApp/1.0 (local-dev; weather-app)",
        },
        cache: "no-store",
      }
    );

    if (!upstream.ok) {
      return NextResponse.json(
        { message: `Location search failed with status ${upstream.status}.` },
        { status: upstream.status }
      );
    }

    const data: unknown = await upstream.json();

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { message: "Received an invalid response from Nominatim." },
        { status: 502 }
      );
    }

    const results = data
      .filter((item): item is NominatimSearchResult => {
        return (
          typeof item === "object" &&
          item !== null &&
          "lat" in item &&
          "lon" in item &&
          "display_name" in item
        );
      })
      .map(mapNominatimResult);

    return NextResponse.json(results);
  } catch {
    return NextResponse.json(
      { message: "Unable to reach the location search service." },
      { status: 502 }
    );
  }
}
