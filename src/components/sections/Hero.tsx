import Link from "next/link";
import { displayBrandName, siteContent } from "@/content/site";
import { HeroMedia } from "./HeroMedia";

export function Hero() {
  const hero = siteContent.home.hero;

  return (
    <section className={`immersive-hero${siteContent.media.hero.desktopSrc ? " has-photo" : " no-photo"}`} aria-labelledby="hero-title">
      <HeroMedia />
      {siteContent.media.hero.desktopSrc && <div className="hero-veil" aria-hidden="true" />}
      <div className="immersive-hero-content">
        <h1 id="hero-title" aria-label={displayBrandName}>
          {[hero.titlePrefix, displayBrandName].map((line) => (
            <span className="hero-title-line" aria-hidden="true" key={line}>
              <span>{line}</span>
            </span>
          ))}
        </h1>
        <p className="hero-positioning">{hero.positioning}</p>
        <p className="hero-intro">{hero.introduction}</p>
        <Link className="hero-cta" href="/reservation">{siteContent.labels.book}</Link>
        <p className="hero-practical">{siteContent.contact.addressLines.slice(0, 2).join(" · ")} · <a href={`tel:${siteContent.contact.phoneHref}`}>{siteContent.contact.phone}</a></p>
      </div>
    </section>
  );
}
