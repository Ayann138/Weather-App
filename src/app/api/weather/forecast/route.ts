import { NextResponse } from "next/server";

import { getWeatherApiKey } from "@/lib/env";

const WEATHER_API_BASE_URL = "https://api.weather-ai.co";

/** Canonical Weather AI paths. `/forecast` on the root host is not a valid API route. */
const UPSTREAM_PATHS = ["/v1/weather", "/v1/forecast"] as const;

function isJsonContentType(contentType: string | null): boolean {
  return Boolean(contentType?.includes("application/json"));
}

async function fetchUpstreamWeather(
  path: string,
  query: URLSearchParams,
  apiKey: string
): Promise<Response> {
  return fetch(`${WEATHER_API_BASE_URL}${path}?${query.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-api-key": apiKey,
      Authorization: `Bearer ${apiKey}`,
    },
    cache: "no-store",
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const days = searchParams.get("days") ?? "7";
  const ai = searchParams.get("ai") ?? "true";
  const units = searchParams.get("units") ?? "metric";
  const lang = searchParams.get("lang");

  if (!lat || !lon) {
    return NextResponse.json(
      { message: "Query parameters lat and lon are required." },
      { status: 400 }
    );
  }

  let apiKey: string;

  try {
    apiKey = getWeatherApiKey();
  } catch {
    return NextResponse.json(
      { message: "Weather API key is not configured on the server." },
      { status: 500 }
    );
  }

  const upstreamParams = new URLSearchParams({
    lat,
    lon,
    days,
    ai,
    units,
  });

  if (lang) {
    upstreamParams.set("lang", lang);
  }

  try {
    let lastStatus = 502;
    let lastPayload: unknown = {
      message: "Unable to reach the Weather AI API.",
    };

    for (const path of UPSTREAM_PATHS) {
      const upstream = await fetchUpstreamWeather(path, upstreamParams, apiKey);
      const contentType = upstream.headers.get("content-type");

      if (isJsonContentType(contentType)) {
        const payload: unknown = await upstream.json();

        if (upstream.ok) {
          return NextResponse.json(payload, { status: 200 });
        }

        lastStatus = upstream.status;
        lastPayload = payload;
        continue;
      }

      // Upstream returned HTML (Firebase 404/503 pages, etc.)
      await upstream.text();
      lastStatus = upstream.status === 404 ? 502 : upstream.status;
      lastPayload = {
        message:
          upstream.status === 503
            ? "Weather AI API is temporarily unavailable. Please try again shortly."
            : `Weather AI API endpoint ${path} is unavailable.`,
        code: `UPSTREAM_${upstream.status}`,
      };
    }

    return NextResponse.json(lastPayload, { status: lastStatus });
  } catch {
    return NextResponse.json(
      { message: "Unable to reach the Weather AI API." },
      { status: 502 }
    );
  }
}
