import { siteContent } from "@/content/site";
import Link from "next/link";

export function Contact() {
  const content = siteContent.home.contact;

  return (
    <section id="contact" className="section-shell home-practical home-band" aria-labelledby="contact-title">
      <div className="home-practical-copy">
        <p className="eyebrow">{content.eyebrow}</p>
        <h2 id="contact-title">{content.title}</h2>
        <p>{content.introduction}</p>
        <div className="home-contact-details">
          <p><span>Téléphone</span><a href={`tel:${siteContent.contact.phoneHref}`}>{siteContent.contact.phone}</a></p>
          <address><span>Adresse</span><span className="address-lines">{siteContent.contact.addressLines.map((line) => <span key={line}>{line}</span>)}</span></address>
        </div>
        <div className="contact-actions"><a className="button button-primary" href={`tel:${siteContent.contact.phoneHref}`}>{siteContent.labels.call}</a><a className="button button-secondary" href={siteContent.contact.mapsUrl} target="_blank" rel="noreferrer">{siteContent.labels.find}</a></div>
      </div>
      <div className="contact-callout">
        <p className="eyebrow">{content.finalEyebrow}</p>
        <h2>{content.finalTitle}</h2>
        <p>{content.finalText}</p>
        <Link className="button button-primary" href="/reservation">{siteContent.labels.book}</Link>
      </div>
    </section>
  );
}
