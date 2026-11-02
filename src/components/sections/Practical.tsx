import { siteContent } from "@/content/site";

export function Practical() {
  const content = siteContent.home.practical;

  return (
    <section className="section-shell split-section practical-section split-section-bordered home-band" aria-labelledby="practical-title">
      <div>
        <p className="eyebrow">{content.eyebrow}</p>
        <h2 id="practical-title">{content.title}</h2>
      </div>
      <div className="prose-large">
        <p>{content.lead}</p>
        {content.paragraphs.map((paragraph) => <p className="section-fact" key={paragraph}>{paragraph}</p>)}
        <a className="button button-primary section-action" href={`tel:${siteContent.contact.phoneHref}`}>{siteContent.labels.call}</a>
      </div>
    </section>
  );
}
