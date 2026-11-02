import Link from "next/link";
import { siteContent } from "@/content/site";

export function Services() {
  const content = siteContent.home.services;

  return (
    <section id="services" className="dark-section home-band" aria-labelledby="services-title">
      <div className="section-shell services-intro"><div><p className="eyebrow eyebrow-light">{content.eyebrow}</p><h2 id="services-title">{content.title}</h2></div><p>{content.introduction}</p></div>
      <div className="section-shell service-preview">
        {siteContent.services.map((service, index) => <div className="service-preview-row" key={service.name}><span>{String(index + 1).padStart(2, "0")}</span><div className="service-preview-copy"><p>{service.name}</p><span>{service.description}</span></div><small>{service.duration} · {service.price}</small></div>)}
      </div>
      <div className="section-shell dark-action"><Link className="button button-light" href="/prestations">{siteContent.labels.viewServices}</Link></div>
    </section>
  );
}
