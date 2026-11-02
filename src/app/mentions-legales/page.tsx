import type { Metadata } from "next";
import Link from "next/link";
import { siteContent } from "@/content/site";

export const metadata: Metadata = { title: siteContent.pages.legal.metadataTitle, description: siteContent.pages.legal.metadataDescription, alternates: { canonical: "/mentions-legales" } };

export default function LegalNoticePage() {
  const content = siteContent.pages.legal;

  return (
    <main id="contenu" className="legal-page section-shell">
      <nav className="breadcrumb" aria-label="Fil d’Ariane"><Link href="/">Accueil</Link><span aria-hidden="true">/</span><span>{content.metadataTitle}</span></nav>
      <div className="legal-layout">
        <h1>{content.titleLines.map((line) => <span className="title-line" key={line}>{line}</span>)}</h1>
        <div className="legal-copy">
          <section><h2>{content.publisherTitle}</h2><p>Nom du salon : {siteContent.brand.name}<br />Adresse : {siteContent.contact.address}<br />Téléphone : {siteContent.contact.phone}<br />Responsable du salon : {siteContent.business.responsible}</p></section>
          <section><h2>{content.additionalTitle}</h2><p>{content.additionalText}</p></section>
          <section><h2>{content.contentTitle}</h2><p>{content.contentText}</p></section>
        </div>
      </div>
    </main>
  );
}
