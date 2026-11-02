export type BookingErrorCode =
  | "SLOT_CONFLICT"
  | "IDEMPOTENCY_CONFLICT"
  | "RATE_LIMITED"
  | "PUBLIC_RESOURCE_UNAVAILABLE"
  | "BOOKING_SITE_UNAVAILABLE"
  | "ORIGIN_NOT_ALLOWED"
  | "INVALID_CHALLENGE"
  | "VALIDATION_ERROR"
  | "SERVICE_UNAVAILABLE"
  | "NETWORK_ERROR"
  | "CONFIGURATION_ERROR"
  | "UNKNOWN_ERROR";

export class BookingApiError extends Error {
  constructor(
    public readonly code: BookingErrorCode,
    message: string,
    public readonly status?: number,
    public readonly retryable = false,
  ) {
    super(message);
    this.name = "BookingApiError";
  }
}

const errorCodeMap: Record<string, BookingErrorCode> = {
  appointment_conflict: "SLOT_CONFLICT",
  idempotency_conflict: "IDEMPOTENCY_CONFLICT",
  rate_limit_exceeded: "RATE_LIMITED",
  public_resource_not_found: "PUBLIC_RESOURCE_UNAVAILABLE",
  booking_site_not_found: "BOOKING_SITE_UNAVAILABLE",
  origin_not_allowed: "ORIGIN_NOT_ALLOWED",
  invalid_challenge: "INVALID_CHALLENGE",
  validation_error: "VALIDATION_ERROR",
  service_unavailable: "SERVICE_UNAVAILABLE",
};

export function mapPublicErrorCode(code: string): BookingErrorCode {
  return errorCodeMap[code] ?? "UNKNOWN_ERROR";
}
