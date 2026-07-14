import type {
  NominatimSearchResult,
  SelectedLocation,
} from "@/types/location";

export class GeocodingError extends Error {
  readonly code: string;

  constructor(message: string, code = "GEOCODING_ERROR") {
    super(message);
    this.name = "GeocodingError";
    this.code = code;
  }
}

function getLocationName(result: NominatimSearchResult): string {
  const address = result.address;

  return (
    address?.city ??
    address?.town ??
    address?.village ??
    address?.municipality ??
    address?.county ??
    result.display_name.split(",")[0]?.trim() ??
    result.display_name
  );
}

export function mapNominatimResult(
  result: NominatimSearchResult
): SelectedLocation {
  const latitude = Number.parseFloat(result.lat);
  const longitude = Number.parseFloat(result.lon);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new GeocodingError(
      "Received invalid coordinates from Nominatim.",
      "INVALID_COORDINATES"
    );
  }

  return {
    name: getLocationName(result),
    latitude,
    longitude,
    country: result.address?.country ?? "Unknown",
  };
}

function isSelectedLocation(value: unknown): value is SelectedLocation {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const location = value as Partial<SelectedLocation>;

  return (
    typeof location.name === "string" &&
    typeof location.country === "string" &&
    typeof location.latitude === "number" &&
    typeof location.longitude === "number"
  );
}

export async function searchCities(
  query: string,
  options?: {
    signal?: AbortSignal;
    limit?: number;
  }
): Promise<SelectedLocation[]> {
  const trimmedQuery = query.trim();

  if (trimmedQuery.length < 2) {
    return [];
  }

  const params = new URLSearchParams({
    q: trimmedQuery,
    limit: String(options?.limit ?? 5),
  });

  let response: Response;

  try {
    response = await fetch(`/api/geocode?${params.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: options?.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    throw new GeocodingError(
      "Unable to reach the location search service.",
      "NETWORK_ERROR"
    );
  }

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
        ? (data as { message: string }).message
        : `Location search failed with status ${response.status}.`;

    throw new GeocodingError(message, `HTTP_${response.status}`);
  }

  if (!Array.isArray(data) || !data.every(isSelectedLocation)) {
    throw new GeocodingError(
      "Received an invalid response from the location search service.",
      "INVALID_RESPONSE"
    );
  }

  return data;
}
