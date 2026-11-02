import type { Metadata } from "next";
import Link from "next/link";
import { siteContent } from "@/content/site";

export const metadata: Metadata = {
  title: siteContent.pages.services.metadataTitle,
  description: siteContent.pages.services.metadataDescription,
  alternates: { canonical: "/prestations" },
};

export default function ServicesPage() {
  const content = siteContent.pages.services;

  return (
    <main id="contenu">
      <header className="page-hero">
        <div className="section-shell">
          <nav className="breadcrumb" aria-label="Fil d’Ariane"><Link href="/">Accueil</Link><span aria-hidden="true">/</span><span>Prestations</span></nav>
          <div className="page-hero-grid">
            <h1>{content.titleLines.map((line) => <span className="title-line" key={line}>{line}</span>)}</h1>
            <div className="page-hero-aside"><p>{content.introduction}</p><Link className="text-link" href="/reservation">{siteContent.labels.book}</Link></div>
          </div>
        </div>
      </header>
      <section className="content-section section-shell" aria-labelledby="catalogue-title">
        <div className="empty-catalog">
          <div><p className="eyebrow">{content.catalogueEyebrow}</p><h2 id="catalogue-title">{content.catalogueTitle}</h2></div>
          <div>
            <div className="pending-list services-list">
              {siteContent.services.map((service, index) => (
                <div className="pending-row service-row" key={service.name}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{service.name}<small className="service-description">{service.description}</small><small className="service-duration">{service.duration}</small></p>
                  <strong className="service-price">{service.price}</strong>
                </div>
              ))}
            </div>
            <div className="catalogue-action"><Link className="button button-primary" href="/reservation">{siteContent.labels.book}</Link></div>
          </div>
        </div>
      </section>
    </main>
  );
}
