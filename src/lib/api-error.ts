export class WeatherApiError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(
    message: string,
    options?: {
      status?: number;
      code?: string;
      details?: unknown;
      cause?: unknown;
    }
  ) {
    super(message, options?.cause ? { cause: options.cause } : undefined);
    this.name = "WeatherApiError";
    this.status = options?.status;
    this.code = options?.code;
    this.details = options?.details;
  }
}

export function isWeatherApiError(error: unknown): error is WeatherApiError {
  return error instanceof WeatherApiError;
}
