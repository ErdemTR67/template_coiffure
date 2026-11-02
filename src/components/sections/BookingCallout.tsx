import Link from "next/link";
import { siteContent } from "@/content/site";

export function BookingCallout() {
  const content = siteContent.home.booking;

  return (
    <section className="section-shell booking-callout home-band" aria-labelledby="booking-title">
      <div className="booking-callout-copy"><p className="eyebrow">{content.eyebrow}</p><h2 id="booking-title">{content.title}</h2><p>{content.introduction}</p><Link className="button button-primary" href="/reservation">{siteContent.labels.book}</Link></div>
      <div><p className="eyebrow">{content.stepsTitle}</p><ol className="booking-steps-preview">{content.steps.map((step) => <li key={step.number}><span>{step.number}</span><div><strong>{step.title}</strong><p>{step.description}</p></div></li>)}</ol></div>
    </section>
  );
}
