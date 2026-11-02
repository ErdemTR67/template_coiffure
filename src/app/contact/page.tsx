import type { Metadata } from "next";
import Link from "next/link";
import { siteContent } from "@/content/site";

export const metadata: Metadata = {
  title: siteContent.pages.contact.metadataTitle,
  description: siteContent.pages.contact.metadataDescription,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const content = siteContent.pages.contact;

  return (
    <main id="contenu">
      <header className="page-hero">
        <div className="section-shell">
          <nav className="breadcrumb" aria-label="Fil d’Ariane"><Link href="/">Accueil</Link><span aria-hidden="true">/</span><span>{content.title}</span></nav>
          <div className="page-hero-grid"><h1>{content.title}</h1><div className="page-hero-aside"><p>{content.introduction}</p><a className="text-link" href={`tel:${siteContent.contact.phoneHref}`}>{siteContent.labels.call}</a></div></div>
        </div>
      </header>
      <section className="content-section section-shell contact-grid">
        <div>
          <section className="contact-block" aria-labelledby="coordinates-title">
            <h2 id="coordinates-title">{content.coordinatesTitle}</h2>
            <div className="contact-value"><span>Téléphone</span><p><a href={`tel:${siteContent.contact.phoneHref}`}>{siteContent.contact.phone}</a></p></div>
            <div className="contact-value"><span>Adresse</span><address>{siteContent.contact.addressLines.map((line) => <span key={line}>{line}</span>)}</address></div>
            <div className="contact-actions"><a className="button button-primary" href={`tel:${siteContent.contact.phoneHref}`}>{siteContent.labels.call}</a><a className="button button-secondary" href={siteContent.contact.mapsUrl} target="_blank" rel="noreferrer">{siteContent.labels.find}</a></div>
          </section>
          <section className="contact-block about-block" aria-labelledby="responsible-title">
            <p className="eyebrow">{content.aboutEyebrow}</p>
            <h2 id="responsible-title">{content.aboutTitle}</h2>
            <p>{content.aboutText}</p>
          </section>
        </div>
        <section aria-labelledby="hours-title">
          <p className="eyebrow">{content.practicalEyebrow}</p>
          <h2 id="hours-title">{content.hoursTitle}</h2>
          <p className="hours-lead">{content.hoursLead}</p>
          <dl className="opening-hours">
            {siteContent.contact.openingHours.map((item) => <div key={item.day}><dt>{item.day}</dt><dd>{item.hours}</dd></div>)}
          </dl>
          <Link className="button button-primary hours-booking" href="/reservation">{siteContent.labels.book}</Link>
        </section>
      </section>
    </main>
  );
}
