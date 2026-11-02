import Link from "next/link";
import { siteContent } from "@/content/site";

export function Hours() {
  const content = siteContent.home.hours;

  return (
    <section className="section-shell hours-section split-section-bordered home-band" aria-labelledby="hours-title">
      <div>
        <p className="eyebrow">{content.eyebrow}</p>
        <h2 id="hours-title">{content.title}</h2>
        <p className="hours-intro">{content.introduction}</p>
        <Link className="button button-primary hours-booking" href="/reservation">{siteContent.labels.book}</Link>
      </div>
      <dl className="opening-hours">
        {siteContent.contact.openingHours.map((item) => <div key={item.day}><dt>{item.day}</dt><dd>{item.hours}</dd></div>)}
      </dl>
    </section>
  );
}
