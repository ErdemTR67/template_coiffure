import Image from "next/image";
import type { CSSProperties } from "react";
import heroImage from "@public/images/hero/hero.png";
import { siteContent } from "@/content/site";

type HeroStyle = CSSProperties & {
  "--hero-position-desktop": string;
  "--hero-position-mobile": string;
};

export function HeroMedia() {
  const hero = siteContent.media.hero;
  const style: HeroStyle = {
    "--hero-position-desktop": hero.desktopObjectPosition,
    "--hero-position-mobile": hero.mobileObjectPosition,
  };

  if (!hero.desktopSrc) {
    return (
      <div className="hero-media hero-media-placeholder" style={style}>
        <div className="hero-placeholder-copy">
          <span>{hero.placeholderLabel}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-media" style={style}>
      <Image
        className="hero-photo"
        src={heroImage}
        alt={hero.alt || hero.fallbackAlt}
        sizes="100vw"
        quality={78}
        placeholder="blur"
        preload
      />
    </div>
  );
}
