"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PublicAppointmentResponse } from "@/types/booking";

const confirmationStorageKey = "bsrm:public-booking-confirmation";

function parseConfirmation(value: string | null): PublicAppointmentResponse | null {
  if (!value) return null;
  try {
    const data = JSON.parse(value) as Partial<PublicAppointmentResponse>;
    if (
      data.status !== "pending" ||
      typeof data.booking_reference !== "string" ||
      typeof data.starts_at !== "string" ||
      !data.location ||
      !data.employee ||
      !data.service
    ) return null;
    return data as PublicAppointmentResponse;
  } catch {
    return null;
  }
}

export function ConfirmationStatus() {
  const [confirmation, setConfirmation] = useState<PublicAppointmentResponse | null | undefined>(undefined);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setConfirmation(parseConfirmation(sessionStorage.getItem(confirmationStorageKey)));
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (confirmation === undefined) {
    return <div className="confirmation-card" aria-live="polite"><div className="status-mark" aria-hidden="true">…</div><h1>Nous confirmons votre rendez-vous.</h1></div>;
  }

  if (!confirmation) {
    return <div className="confirmation-card" role="alert"><div className="status-mark" aria-hidden="true">!</div><h1>Aucune réservation récente.</h1><p>Vous pouvez commencer une nouvelle réservation.</p><Link className="button button-primary" href="/reservation">Prendre rendez-vous</Link></div>;
  }

  const date = new Intl.DateTimeFormat("fr-BE", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: confirmation.location.timezone,
  }).format(new Date(confirmation.starts_at));

  return (
    <div className="confirmation-card" aria-live="polite">
      <div className="status-mark" aria-hidden="true">✓</div>
      <p className="eyebrow">Rendez-vous enregistré</p>
      <h1>Votre demande est bien reçue.</h1>
      <p>
        Référence <strong>{confirmation.booking_reference}</strong>. Statut : en attente.
        Le salon confirmera le rendez-vous.
      </p>
      <dl className="confirmation-summary">
        <div><dt>Établissement</dt><dd>{confirmation.location.name}</dd></div>
        <div><dt>Prestation</dt><dd>{confirmation.service.name}</dd></div>
        <div><dt>Professionnel</dt><dd>{confirmation.employee.display_name}</dd></div>
        <div><dt>Date</dt><dd>{date}</dd></div>
      </dl>
      <Link className="button button-primary" href="/">Retour à l’accueil</Link>
    </div>
  );
}
