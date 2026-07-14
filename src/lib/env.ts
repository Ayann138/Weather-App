export function getWeatherApiKey(): string {
  const apiKey =
    process.env.WEATHER_API_KEY ?? process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing WEATHER_API_KEY or NEXT_PUBLIC_WEATHER_API_KEY environment variable."
    );
  }

  return apiKey;
}
