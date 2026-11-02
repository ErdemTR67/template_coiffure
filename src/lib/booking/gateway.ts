import { BookingApiError, mapPublicErrorCode } from "./errors";
import type {
  PublicApiErrorResponse,
  PublicAppointmentCreate,
  PublicAppointmentResponse,
  PublicAvailabilitySlotResponse,
  PublicBookingContextResponse,
  PublicEmployeeResponse,
  PublicLocationResponse,
  PublicServiceResponse,
} from "@/types/booking";

const PUBLIC_BOOKING_PATH = "/api/v1/public/booking";

export interface CreateAppointmentAttempt {
  body: PublicAppointmentCreate;
  idempotencyKey: string;
  challengeToken: string;
}

export interface BookingGateway {
  getContext(): Promise<PublicBookingContextResponse>;
  getLocations(): Promise<PublicLocationResponse[]>;
  getServices(locationId: string): Promise<PublicServiceResponse[]>;
  getEmployees(locationId: string, serviceId: string): Promise<PublicEmployeeResponse[]>;
  getAvailability(input: {
    locationId: string;
    serviceId: string;
    date: string;
    employeeId?: string;
  }): Promise<PublicAvailabilitySlotResponse[]>;
  createAppointment(attempt: CreateAppointmentAttempt): Promise<PublicAppointmentResponse>;
}

export interface BookingGatewayConfig {
  baseUrl: string;
  siteKey: string;
}

function normalizeBaseUrl(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

function assertConfiguration(config: BookingGatewayConfig) {
  if (!config.baseUrl || !config.siteKey) {
    throw new BookingApiError(
      "CONFIGURATION_ERROR",
      "La réservation en ligne n’est pas configurée.",
      undefined,
      false,
    );
  }
}

async function readError(response: Response): Promise<BookingApiError> {
  let payload: PublicApiErrorResponse | null = null;
  try {
    payload = (await response.json()) as PublicApiErrorResponse;
  } catch {
    payload = null;
  }
  const publicCode = payload?.error?.code ?? "unknown_error";
  const code = mapPublicErrorCode(publicCode);
  const retryable = code === "RATE_LIMITED" || code === "SERVICE_UNAVAILABLE";
  return new BookingApiError(
    code,
    payload?.error?.message ?? "Le service de réservation ne répond pas.",
    response.status,
    retryable,
  );
}

export function createBookingGateway(config: BookingGatewayConfig): BookingGateway {
  const baseUrl = normalizeBaseUrl(config.baseUrl);
  const root = `${baseUrl}${PUBLIC_BOOKING_PATH}`;

  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    assertConfiguration(config);
    let response: Response;
    const headers = new Headers(init?.headers);
    headers.set("Accept", "application/json");
    headers.set("X-BSRM-Site-Key", config.siteKey);
    try {
      response = await fetch(`${root}${path}`, {
        ...init,
        cache: "no-store",
        headers,
      });
    } catch {
      throw new BookingApiError(
        "NETWORK_ERROR",
        "Impossible de joindre le service de réservation.",
        undefined,
        true,
      );
    }
    if (!response.ok) throw await readError(response);
    return (await response.json()) as T;
  }

  async function read<T>(path: string): Promise<T> {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        return await request<T>(path);
      } catch (error) {
        const retryable = error instanceof BookingApiError && error.retryable;
        if (!retryable || attempt === 2) throw error;
        await new Promise((resolve) => window.setTimeout(resolve, 300 * 2 ** attempt));
      }
    }
    throw new BookingApiError("UNKNOWN_ERROR", "La lecture a échoué.");
  }

  return {
    getContext: () => read<PublicBookingContextResponse>("/context"),
    getLocations: () => read<PublicLocationResponse[]>("/locations"),
    getServices: (locationId) => {
      const query = new URLSearchParams({ location_id: locationId });
      return read<PublicServiceResponse[]>(`/services?${query}`);
    },
    getEmployees: (locationId, serviceId) => {
      const query = new URLSearchParams({ location_id: locationId, service_id: serviceId });
      return read<PublicEmployeeResponse[]>(`/employees?${query}`);
    },
    getAvailability: ({ locationId, serviceId, date, employeeId }) => {
      const query = new URLSearchParams({
        location_id: locationId,
        service_id: serviceId,
        date,
      });
      if (employeeId) query.set("employee_id", employeeId);
      return read<PublicAvailabilitySlotResponse[]>(`/availability?${query}`);
    },
    createAppointment: ({ body, idempotencyKey, challengeToken }) =>
      request<PublicAppointmentResponse>("/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
          "X-Booking-Challenge": challengeToken,
        },
        body: JSON.stringify(body),
      }),
  };
}
