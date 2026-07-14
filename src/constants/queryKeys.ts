export const queryKeys = {
  weather: {
    all: ["weather"] as const,
    detail: (latitude: number, longitude: number, days: number) =>
      [...queryKeys.weather.all, { latitude, longitude, days }] as const,
  },
} as const;
