import type { Metadata } from "next";
import Link from "next/link";
import { siteContent } from "@/content/site";

export const metadata: Metadata = { title: siteContent.pages.privacy.metadataTitle, description: siteContent.pages.privacy.metadataDescription, alternates: { canonical: "/confidentialite" } };

export default function PrivacyPage() {
  const content = siteContent.pages.privacy;

  return (
    <main id="contenu" className="legal-page section-shell">
      <nav className="breadcrumb" aria-label="Fil d’Ariane"><Link href="/">Accueil</Link><span aria-hidden="true">/</span><span>{content.title}</span></nav>
      <div className="legal-layout">
        <h1>{content.title}</h1>
        <div className="legal-copy">
          {content.sections.slice(0, 2).map((section) => <section key={section.title}><h2>{section.title}</h2><p>{section.text}</p></section>)}
          <section><h2>{content.rightsTitle}</h2><p>{content.rightsText} <a href={`tel:${siteContent.contact.phoneHref}`}>{siteContent.contact.phone}</a>.</p></section>
          {content.sections.slice(2).map((section) => <section key={section.title}><h2>{section.title}</h2><p>{section.text}</p></section>)}
        </div>
      </div>
    </main>
  );
}
