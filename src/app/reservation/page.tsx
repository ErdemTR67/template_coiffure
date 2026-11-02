import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { siteContent } from "@/content/site";

export const metadata: Metadata = {
  title: siteContent.pages.booking.metadataTitle,
  description: siteContent.pages.booking.metadataDescription,
  alternates: { canonical: "/reservation" },
};

export default function BookingPage() {
  const turnstileSiteKey = process.env.TURNSTILE_SITE_KEY ?? "";
  return <main id="contenu" className="booking-page"><BookingWizard turnstileSiteKey={turnstileSiteKey} /></main>;
}
