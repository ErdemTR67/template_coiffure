/* Copyright (c) 2026 Erdem Topcu. All rights reserved. */
import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBookingBar } from "@/components/layout/MobileBookingBar";
import { siteContent, siteUrl } from "@/content/site";
import "./globals.css";

const title = siteContent.seo.defaultTitle;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s | ${siteContent.brand.name}` },
  description: siteContent.seo.defaultDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_BE",
    url: "/",
    siteName: siteContent.brand.name,
    title,
    description: siteContent.seo.openGraphDescription,
  },
  robots: siteContent.publication.isReady ? { index: true, follow: true } : { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="fr"><body><a className="skip-link" href="#contenu">Aller au contenu</a><Header />{children}<Footer /><MobileBookingBar /></body></html>;
}
