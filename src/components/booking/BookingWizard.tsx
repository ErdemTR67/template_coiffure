"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { siteContent } from "@/content/site";
import { BookingApiError } from "@/lib/booking/errors";
import { createBookingGateway, type CreateAppointmentAttempt } from "@/lib/booking/gateway";
import { publicBookingEnvironment } from "@/lib/booking/public-environment";
import type {
  PublicAppointmentCreate,
  PublicAvailabilitySlotResponse,
  PublicBookingContextResponse,
  PublicEmployeeResponse,
  PublicLocationResponse,
  PublicServiceResponse,
} from "@/types/booking";
import { TurnstileWidget } from "./TurnstileWidget";

const steps = ["Prestation", "Coiffeur", "Jour & heure", "Vos informations"];
const confirmationStorageKey = "bsrm:public-booking-confirmation";
const weekdayLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

type RequestState = "loading" | "ready" | "error" | "disabled";

interface CustomerForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface InitialData {
  context: PublicBookingContextResponse;
  location: PublicLocationResponse | null;
  services: PublicServiceResponse[];
  message: string;
}

const emptyCustomer: CustomerForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

function currentDateIn(timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function monthStart(month: string): Date {
  return new Date(`${month}-01T12:00:00Z`);
}

function monthKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function shiftMonth(month: string, amount: number): string {
  const value = monthStart(month);
  value.setUTCMonth(value.getUTCMonth() + amount);
  return monthKey(value);
}

function daysForMonth(month: string): Array<string | null> {
  const firstDay = monthStart(month);
  const leadingEmptyDays = (firstDay.getUTCDay() + 6) % 7;
  const daysInMonth = new Date(
    Date.UTC(firstDay.getUTCFullYear(), firstDay.getUTCMonth() + 1, 0),
  ).getUTCDate();
  return [
    ...Array.from<null>({ length: leadingEmptyDays }).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => `${month}-${String(index + 1).padStart(2, "0")}`),
  ];
}

function formatCalendarDate(value: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("fr-BE", { ...options, timeZone: "UTC" }).format(
    new Date(`${value}T12:00:00Z`),
  );
}

function formatMoney(priceCents: number, currency: string): string {
  return new Intl.NumberFormat("fr-BE", { style: "currency", currency }).format(priceCents / 100);
}

function friendlyError(error: unknown): string {
  if (!(error instanceof BookingApiError)) return "Une erreur inattendue empêche la réservation.";
  switch (error.code) {
    case "RATE_LIMITED":
      return "Trop de demandes ont été envoyées. Patientez quelques instants avant de réessayer.";
    case "ORIGIN_NOT_ALLOWED":
      return "La réservation en ligne n’est pas disponible depuis ce site.";
    case "INVALID_CHALLENGE":
      return "La vérification anti-bot a expiré. Effectuez-la à nouveau.";
    case "IDEMPOTENCY_CONFLICT":
      return "Cette tentative ne peut pas être rejouée. Revenez à l’étape précédente puis réessayez.";
    case "VALIDATION_ERROR":
      return "Certaines informations ne sont pas valides. Vérifiez le formulaire.";
    case "SERVICE_UNAVAILABLE":
    case "NETWORK_ERROR":
      return "La réponse du service est incertaine. Réessayez : la même demande sera utilisée.";
    case "CONFIGURATION_ERROR":
      return "La réservation est momentanément indisponible.";
    default:
      return error.message || "Le service de réservation ne répond pas.";
  }
}

function isUnavailableResource(error: unknown): boolean {
  return error instanceof BookingApiError && error.code === "PUBLIC_RESOURCE_UNAVAILABLE";
}

function BookingUnavailable({ onRetry }: { onRetry?: () => void }) {
  const content = siteContent.pages.booking.unavailable;

  return (
    <section className="booking-unavailable booking-unavailable-screen section-shell" role="alert">
      <p className="eyebrow">{content.eyebrow}</p>
      <h1>{content.title}</h1>
      <p>
        {content.text}{" "}
        <a className="booking-phone-link" href={`tel:${siteContent.contact.phoneHref}`}>
          {siteContent.contact.phone}
        </a>
        .
      </p>
      <div className="booking-unavailable-actions">
        <a className="button button-primary" href={`tel:${siteContent.contact.phoneHref}`}>
          {siteContent.labels.call}
        </a>
      </div>
    </section>
  );
}

export function BookingWizard({ turnstileSiteKey }: { turnstileSiteKey: string }) {
  const router = useRouter();
  const gateway = useMemo(
    () => createBookingGateway({
      baseUrl: publicBookingEnvironment.apiUrl,
      siteKey: publicBookingEnvironment.siteKey,
    }),
    [],
  );
  const [step, setStep] = useState(0);
  const [requestState, setRequestState] = useState<RequestState>("loading");
  const [message, setMessage] = useState("");
  const [context, setContext] = useState<PublicBookingContextResponse | null>(null);
  const [location, setLocation] = useState<PublicLocationResponse | null>(null);
  const [services, setServices] = useState<PublicServiceResponse[]>([]);
  const [employees, setEmployees] = useState<PublicEmployeeResponse[]>([]);
  const [slots, setSlots] = useState<PublicAvailabilitySlotResponse[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [selectedSlotKey, setSelectedSlotKey] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [customer, setCustomer] = useState<CustomerForm>(emptyCustomer);
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [challengeToken, setChallengeToken] = useState("");
  const [challengeResetSignal, setChallengeResetSignal] = useState(0);
  const [attempt, setAttempt] = useState<Omit<CreateAppointmentAttempt, "challengeToken"> | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const availabilityRequestRef = useRef(0);

  const fetchInitialData = useCallback(async (): Promise<InitialData> => {
    const nextContext = await gateway.getContext();
    if (!nextContext.booking.enabled) {
      return { context: nextContext, location: null, services: [], message: "" };
    }
    const locations = await gateway.getLocations();
    const nextLocation =
      locations.find((item) => item.id === nextContext.booking.default_location_id) ??
      locations[0] ??
      null;
    if (!nextLocation) {
      return {
        context: nextContext,
        location: null,
        services: [],
        message: "La réservation en ligne n’est pas encore disponible.",
      };
    }
    try {
      const nextServices = await gateway.getServices(nextLocation.id);
      return {
        context: nextContext,
        location: nextLocation,
        services: nextServices,
        message: nextServices.length === 0 ? "Aucune prestation n’est disponible pour le moment." : "",
      };
    } catch (error) {
      if (!isUnavailableResource(error)) throw error;
      return {
        context: nextContext,
        location: nextLocation,
        services: [],
        message: "Les prestations ne sont pas disponibles pour le moment.",
      };
    }
  }, [gateway]);

  function applyInitialData(data: InitialData) {
    setContext(data.context);
    setLocation(data.location);
    setServices(data.services);
    setMessage(data.message);
    setRequestState(data.context.booking.enabled ? "ready" : "disabled");
  }

  useEffect(() => {
    let active = true;
    fetchInitialData()
      .then((data) => { if (active) applyInitialData(data); })
      .catch((error: unknown) => {
        if (!active) return;
        setMessage(friendlyError(error));
        setRequestState("error");
      });
    return () => { active = false; };
  }, [fetchInitialData]);

  async function retryInitialData() {
    setRequestState("loading");
    setMessage("");
    try {
      applyInitialData(await fetchInitialData());
    } catch (error) {
      setMessage(friendlyError(error));
      setRequestState("error");
    }
  }

  function invalidateAttempt() {
    setAttempt(null);
    setChallengeToken("");
    setChallengeResetSignal((value) => value + 1);
  }

  function updateCustomer(nextCustomer: CustomerForm) {
    setCustomer(nextCustomer);
    if (attempt) invalidateAttempt();
  }

  function chooseService(nextServiceId: string) {
    setServiceId(nextServiceId);
    setEmployeeId("");
    setDate("");
    setSelectedSlotKey("");
    setEmployees([]);
    setSlots([]);
    setMessage("");
    invalidateAttempt();
  }

  async function continueToEmployees() {
    if (!location || !serviceId) return;
    setRequestState("loading");
    setMessage("");
    try {
      const nextEmployees = await gateway.getEmployees(location.id, serviceId);
      setEmployees(nextEmployees);
      setStep(1);
      setRequestState("ready");
    } catch (error) {
      setEmployees([]);
      setMessage(isUnavailableResource(error) ? "Les coiffeurs ne sont pas disponibles pour le moment." : friendlyError(error));
      setStep(1);
      setRequestState("ready");
    }
  }

  async function loadAvailability(
    nextDate = date,
    nextEmployeeId = employeeId,
    successMessage = "",
  ) {
    if (!location || !serviceId || !nextDate) return;
    const requestId = availabilityRequestRef.current + 1;
    availabilityRequestRef.current = requestId;
    setAvailabilityLoading(true);
    setMessage("");
    setSelectedSlotKey("");
    invalidateAttempt();
    try {
      const nextSlots = await gateway.getAvailability({
        locationId: location.id,
        serviceId,
        date: nextDate,
        employeeId: nextEmployeeId || undefined,
      });
      if (requestId !== availabilityRequestRef.current) return;
      setSlots(nextSlots);
      setMessage(nextSlots.length === 0 ? "Aucun créneau disponible à cette date." : successMessage);
    } catch (error) {
      if (requestId !== availabilityRequestRef.current) return;
      setSlots([]);
      setMessage(isUnavailableResource(error) ? "Aucun créneau disponible pour cette sélection." : friendlyError(error));
    } finally {
      if (requestId === availabilityRequestRef.current) setAvailabilityLoading(false);
    }
  }

  function continueToDate() {
    setStep(2);
    setCalendarMonth((date || minDate).slice(0, 7));
    setSelectedSlotKey("");
    setSlots([]);
    invalidateAttempt();
    if (date) void loadAvailability(date, employeeId);
  }

  function handleDateChange(nextDate: string) {
    setDate(nextDate);
    setCalendarMonth(nextDate.slice(0, 7));
    setSelectedSlotKey("");
    setSlots([]);
    invalidateAttempt();
    if (nextDate) void loadAvailability(nextDate, employeeId);
  }

  const visibleSlots = useMemo(() => {
    if (employeeId) return slots;
    const byStart = new Map<string, PublicAvailabilitySlotResponse>();
    for (const item of slots) {
      if (!byStart.has(item.starts_at)) byStart.set(item.starts_at, item);
    }
    return [...byStart.values()];
  }, [employeeId, slots]);

  const service = services.find((item) => item.id === serviceId);
  const employee = employees.find((item) => item.id === employeeId);
  const slot = visibleSlots.find(
    (item) => `${item.employee_id}:${item.starts_at}` === selectedSlotKey,
  );
  const slotEmployee = slot
    ? employees.find((item) => item.id === slot.employee_id)
    : undefined;
  const minDate = currentDateIn(location?.timezone ?? "Europe/Brussels");
  const maxDate = context
    ? (() => {
        const value = new Date(`${minDate}T12:00:00Z`);
        value.setUTCDate(value.getUTCDate() + context.booking.maximum_advance_days);
        return value.toISOString().slice(0, 10);
      })()
    : undefined;
  const calendarDays = daysForMonth(calendarMonth);
  const minimumMonth = minDate.slice(0, 7);
  const maximumMonth = maxDate?.slice(0, 7);

  function makeAppointmentBody(): PublicAppointmentCreate | null {
    if (!location || !slot) return null;
    return {
      location_id: location.id,
      employee_id: slot.employee_id,
      service_id: serviceId,
      starts_at: slot.starts_at,
      customer: {
        first_name: customer.firstName.trim(),
        last_name: customer.lastName.trim(),
        email: customer.email.trim(),
        phone: customer.phone.trim(),
        marketing_consent: false,
      },
    };
  }

  async function performAppointment(nextAttempt: Omit<CreateAppointmentAttempt, "challengeToken">) {
    submittingRef.current = true;
    setSubmitting(true);
    setMessage("");
    try {
      const confirmation = await gateway.createAppointment({ ...nextAttempt, challengeToken });
      sessionStorage.setItem(confirmationStorageKey, JSON.stringify(confirmation));
      router.push("/confirmation");
    } catch (error) {
      submittingRef.current = false;
      setSubmitting(false);
      setChallengeToken("");
      setChallengeResetSignal((value) => value + 1);
      if (error instanceof BookingApiError && error.code === "SLOT_CONFLICT") {
        setAttempt(null);
        setSelectedSlotKey("");
        setStep(2);
        void loadAvailability(
          date,
          employeeId,
          "Ce créneau vient d’être pris. Vos informations sont conservées ; choisissez un nouvel horaire.",
        );
        return;
      }
      setMessage(friendlyError(error));
    }
  }

  async function submitBooking(event: FormEvent) {
    event.preventDefault();
    if (!declarationAccepted || !challengeToken || submittingRef.current) return;
    if (attempt) {
      await performAppointment(attempt);
      return;
    }
    const body = makeAppointmentBody();
    if (!body) return;
    const nextAttempt = { body, idempotencyKey: crypto.randomUUID() };
    setAttempt(nextAttempt);
    await performAppointment(nextAttempt);
  }

  if (requestState === "disabled" || (requestState === "ready" && !location)) {
    return <BookingUnavailable />;
  }

  if (requestState === "error") {
    return <BookingUnavailable onRetry={() => void retryInitialData()} />;
  }

  return (
    <div className="simple-booking section-shell">
      <header className="simple-booking-header">
        <p className="eyebrow">Prendre rendez-vous</p>
        <h1>Prendre rendez-vous</h1>
      </header>

      <ol className="simple-progress" aria-label="Étapes de la réservation">
        {steps.map((label, index) => (
          <li key={label} aria-current={index === step ? "step" : undefined}>
            <span>{index + 1}</span>{label}
          </li>
        ))}
      </ol>

      <section className="simple-booking-panel" aria-live="polite" aria-busy={requestState === "loading" || availabilityLoading}>
        {requestState === "loading" && (
          <div className="skeleton-stack" aria-label="Chargement">
            <div className="skeleton" /><div className="skeleton" /><div className="skeleton" />
          </div>
        )}

        {requestState === "ready" && step === 0 && (
          <div>
            <h2>Choisissez votre prestation</h2>
            <div className="choice-list">
              {services.map((item) => (
                <label className="choice-card" key={item.id}>
                  <input type="radio" name="service" checked={serviceId === item.id} onChange={() => chooseService(item.id)} />
                  <span><strong>{item.name}</strong><small>{item.duration_minutes} min · {item.price_cents === null ? "Prix sur place" : formatMoney(item.price_cents, item.currency)}</small></span>
                </label>
              ))}
            </div>
            {message && <p className="empty-message" role="status">{message}</p>}
            <div className="booking-actions"><span /><button className="button button-primary" disabled={!serviceId} onClick={() => void continueToEmployees()}>Continuer</button></div>
          </div>
        )}

        {requestState === "ready" && step === 1 && (
          <div>
            <h2>Choisissez votre coiffeur</h2>
            <div className="choice-list">
              <label className="choice-card"><input type="radio" name="employee" checked={employeeId === ""} onChange={() => { setEmployeeId(""); setSlots([]); invalidateAttempt(); }} /><span><strong>Sans préférence</strong><small>Le premier coiffeur disponible</small></span></label>
              {employees.map((item) => (
                <label className="choice-card" key={item.id}><input type="radio" name="employee" checked={employeeId === item.id} onChange={() => { setEmployeeId(item.id); setSlots([]); invalidateAttempt(); }} /><span><strong>{item.display_name}</strong></span></label>
              ))}
            </div>
            {message && <p className="empty-message" role="status">{message}</p>}
            <div className="booking-actions"><button className="button button-secondary" onClick={() => setStep(0)}>Retour</button><button className="button button-primary" onClick={continueToDate}>Continuer</button></div>
          </div>
        )}

        {requestState === "ready" && step === 2 && (
          <div>
            <h2>Choisissez le jour et l’heure</h2>
            <div className="datetime-picker">
              <section className="calendar-card" aria-label="Calendrier de réservation">
                <div className="calendar-header">
                  <button
                    className="calendar-nav"
                    type="button"
                    aria-label="Mois précédent"
                    disabled={calendarMonth <= minimumMonth}
                    onClick={() => setCalendarMonth((value) => shiftMonth(value, -1))}
                  >
                    ←
                  </button>
                  <h3>{formatCalendarDate(`${calendarMonth}-01`, { month: "long", year: "numeric" })}</h3>
                  <button
                    className="calendar-nav"
                    type="button"
                    aria-label="Mois suivant"
                    disabled={Boolean(maximumMonth && calendarMonth >= maximumMonth)}
                    onClick={() => setCalendarMonth((value) => shiftMonth(value, 1))}
                  >
                    →
                  </button>
                </div>
                <div className="calendar-weekdays" aria-hidden="true">
                  {weekdayLabels.map((label) => <span key={label}>{label}</span>)}
                </div>
                <div className="calendar-grid">
                  {calendarDays.map((day, index) => {
                    if (!day) return <span className="calendar-day calendar-day-empty" key={`empty-${index}`} aria-hidden="true" />;
                    const outsideRange = day < minDate || Boolean(maxDate && day > maxDate);
                    const selected = day === date;
                    return (
                      <button
                        className={`calendar-day${selected ? " selected" : ""}${day === minDate ? " today" : ""}`}
                        type="button"
                        key={day}
                        disabled={outsideRange}
                        aria-pressed={selected}
                        aria-label={formatCalendarDate(day, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                        onClick={() => handleDateChange(day)}
                      >
                        <span>{Number(day.slice(-2))}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="time-picker" aria-label="Horaires disponibles" aria-live="polite">
                <p className="time-picker-kicker">Horaires</p>
                <h3>{date ? formatCalendarDate(date, { weekday: "long", day: "numeric", month: "long" }) : "Choisissez un jour"}</h3>
                {!date && <p className="time-picker-help">Sélectionnez une date dans le calendrier pour afficher les créneaux.</p>}
                {availabilityLoading && <p className="time-picker-status">Recherche des horaires…</p>}
                {!availabilityLoading && message && <p className="empty-message" role="status">{message}</p>}
                {!availabilityLoading && (
                  <div className="slot-grid">
                    {visibleSlots.map((item) => {
                      const key = `${item.employee_id}:${item.starts_at}`;
                      return <button className={selectedSlotKey === key ? "slot selected" : "slot"} type="button" key={key} aria-pressed={selectedSlotKey === key} onClick={() => { setSelectedSlotKey(key); invalidateAttempt(); }}>{new Intl.DateTimeFormat("fr-BE", { hour: "2-digit", minute: "2-digit", timeZone: location?.timezone }).format(new Date(item.starts_at))}</button>;
                    })}
                  </div>
                )}
              </section>
            </div>
            <div className="booking-actions"><button className="button button-secondary" onClick={() => setStep(1)}>Retour</button><button className="button button-primary" disabled={!selectedSlotKey} onClick={() => setStep(3)}>Continuer</button></div>
          </div>
        )}

        {requestState === "ready" && step === 3 && (
          <form onSubmit={submitBooking}>
            <h2>Vos informations</h2>
            <dl className="appointment-recap">
              <div><dt>Prestation</dt><dd>{service?.name}</dd></div>
              <div><dt>Coiffeur</dt><dd>{employee?.display_name ?? slotEmployee?.display_name ?? "Sans préférence"}</dd></div>
              <div><dt>Rendez-vous</dt><dd>{slot ? new Intl.DateTimeFormat("fr-BE", { dateStyle: "long", timeStyle: "short", timeZone: location?.timezone }).format(new Date(slot.starts_at)) : ""}</dd></div>
            </dl>
            <div className="form-grid">
              <label className="field"><span>Prénom</span><input autoComplete="given-name" required maxLength={100} value={customer.firstName} onChange={(event) => updateCustomer({ ...customer, firstName: event.target.value })} /></label>
              <label className="field"><span>Nom</span><input autoComplete="family-name" required maxLength={100} value={customer.lastName} onChange={(event) => updateCustomer({ ...customer, lastName: event.target.value })} /></label>
              <label className="field"><span>E-mail</span><input type="email" autoComplete="email" required maxLength={255} value={customer.email} onChange={(event) => updateCustomer({ ...customer, email: event.target.value })} /></label>
              <label className="field"><span>Téléphone</span><input type="tel" autoComplete="tel" required maxLength={50} value={customer.phone} onChange={(event) => updateCustomer({ ...customer, phone: event.target.value })} /></label>
            </div>
            <label className="consent-field declaration-field"><input type="checkbox" required checked={declarationAccepted} onChange={(event) => setDeclarationAccepted(event.target.checked)} /><span>Je déclare que les informations saisies sont exactes et j’accepte leur utilisation pour traiter mon rendez-vous, conformément à la <a href="/confidentialite">politique de confidentialité</a>.</span></label>
            <TurnstileWidget siteKey={turnstileSiteKey} resetSignal={challengeResetSignal} onToken={setChallengeToken} />
            {message && <div className="booking-alert" role="alert"><span aria-hidden="true">!</span><div><strong>Rendez-vous non enregistré</strong><p>{message}</p></div></div>}
            <div className="booking-actions"><button className="button button-secondary" type="button" disabled={submitting} onClick={() => { invalidateAttempt(); setStep(2); }}>Retour</button><button className="button button-primary" type="submit" disabled={!declarationAccepted || !challengeToken || submitting}>{submitting ? "Confirmation…" : attempt ? "Réessayer" : "Confirmer le rendez-vous"}</button></div>
          </form>
        )}
      </section>
    </div>
  );
}
