import Link from "next/link";
import { siteContent } from "@/content/site";

export function About() {
  const { salon, about } = siteContent.home;

  return (
    <>
      <section id="le-salon" className="section-shell split-section home-band" aria-labelledby="salon-title">
        <div><p className="eyebrow">{salon.eyebrow}</p><h2 id="salon-title">{salon.title}</h2></div>
        <div className="prose-large">
          <p>{salon.lead}</p>
          {salon.paragraphs.map((paragraph) => <p className="section-fact" key={paragraph}>{paragraph}</p>)}
          <Link className="button button-primary section-action" href="/reservation">{siteContent.labels.book}</Link>
        </div>
      </section>
      <section id="a-propos" className="section-shell split-section split-section-bordered home-band" aria-labelledby="about-title">
        <div><p className="eyebrow">{about.eyebrow}</p><h2 id="about-title">{about.title}</h2></div>
        <div className="prose-large">
          <p>{about.lead}</p>
          {about.paragraphs.map((paragraph) => <p className="section-fact" key={paragraph}>{paragraph}</p>)}
        </div>
      </section>
    </>
  );
}
