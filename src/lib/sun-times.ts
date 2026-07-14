/**
 * Approximate local sunrise / sunset using a compact solar-position model.
 * Used when the Weather AI response does not include sunrise/sunset fields.
 */
export type SunTimes = {
  sunrise: Date;
  sunset: Date;
};

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

export function getSunTimes(
  latitude: number,
  longitude: number,
  date: Date = new Date()
): SunTimes {
  const day = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0)
  );
  const start = Date.UTC(day.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((day.getTime() - start) / 86_400_000);

  const fractionalYear =
    ((2 * Math.PI) / 365) * (dayOfYear - 1 + (12 - 12) / 24);

  const eqTime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(fractionalYear) -
      0.032077 * Math.sin(fractionalYear) -
      0.014615 * Math.cos(2 * fractionalYear) -
      0.040849 * Math.sin(2 * fractionalYear));

  const decl =
    0.006918 -
    0.399912 * Math.cos(fractionalYear) +
    0.070257 * Math.sin(fractionalYear) -
    0.006758 * Math.cos(2 * fractionalYear) +
    0.000907 * Math.sin(2 * fractionalYear) -
    0.002697 * Math.cos(3 * fractionalYear) +
    0.00148 * Math.sin(3 * fractionalYear);

  const latRad = toRadians(latitude);
  const cosHourAngle =
    (Math.cos(toRadians(90.833)) / (Math.cos(latRad) * Math.cos(decl))) -
    Math.tan(latRad) * Math.tan(decl);

  const clamped = Math.min(1, Math.max(-1, cosHourAngle));
  const hourAngle = toDegrees(Math.acos(clamped));

  const sunriseMinutes = 720 - 4 * (longitude + hourAngle) - eqTime;
  const sunsetMinutes = 720 - 4 * (longitude - hourAngle) - eqTime;

  return {
    sunrise: minutesToDate(day, sunriseMinutes),
    sunset: minutesToDate(day, sunsetMinutes),
  };
}

function minutesToDate(day: Date, minutesUtc: number): Date {
  const result = new Date(day);
  const hours = Math.floor(minutesUtc / 60);
  const minutes = Math.floor(minutesUtc % 60);
  result.setUTCHours(hours, minutes, 0, 0);
  return result;
}

export function formatSunTime(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
