export interface PublicBookingContextResponse {
  business: {
    name: string;
    slug: string;
  };
  booking: {
    enabled: boolean;
    default_location_id: string | null;
    slot_interval_minutes: number;
    minimum_notice_minutes: number;
    maximum_advance_days: number;
    require_phone: boolean;
  };
}

export interface PublicOpeningHour {
  weekday: number;
  starts_at: string;
  ends_at: string;
}

export interface PublicLocationResponse {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  address_line_1: string | null;
  address_line_2: string | null;
  postal_code: string | null;
  city: string | null;
  country_code: string;
  opening_hours: PublicOpeningHour[];
}

export interface PublicServiceResponse {
  id: string;
  location_id: string | null;
  name: string;
  description: string | null;
  duration_minutes: number;
  price_cents: number | null;
  currency: string;
}

export interface PublicEmployeeResponse {
  id: string;
  display_name: string;
  display_color: string | null;
}

export interface PublicAvailabilitySlotResponse {
  employee_id: string;
  service_id: string;
  starts_at: string;
  ends_at: string;
  duration_minutes: number;
  total_duration_minutes: number;
  price_cents: number | null;
  currency: string;
}

export interface PublicAppointmentCustomerCreate {
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  marketing_consent: boolean;
}

export interface PublicAppointmentCreate {
  location_id: string;
  employee_id: string;
  service_id: string;
  starts_at: string;
  customer: PublicAppointmentCustomerCreate;
  customer_note?: string;
}

export interface PublicAppointmentResponse {
  booking_reference: string;
  status: "pending";
  location: {
    id: string;
    name: string;
    timezone: string;
  };
  employee: {
    id: string;
    display_name: string;
  };
  service: {
    id: string;
    name: string;
    duration_minutes: number;
    price_cents: number | null;
    currency: string;
  };
  starts_at: string;
  ends_at: string;
}

export interface PublicApiValidationDetail {
  location: Array<string | number>;
  message: string;
  type: string;
}

export interface PublicApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: PublicApiValidationDetail[];
  };
}
