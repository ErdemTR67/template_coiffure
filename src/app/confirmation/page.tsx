import type { Metadata } from "next";
import { ConfirmationStatus } from "@/components/booking/ConfirmationStatus";
import { siteContent } from "@/content/site";

export const metadata: Metadata = {
  title: siteContent.pages.confirmation.metadataTitle,
  description: siteContent.pages.confirmation.metadataDescription,
  robots: { index: false, follow: false },
};

export default function ConfirmationPage() {
  return <main id="contenu" className="section-shell"><ConfirmationStatus /></main>;
}
