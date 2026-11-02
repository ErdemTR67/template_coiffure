import Link from "next/link";
import { siteContent } from "@/content/site";
import { Logo } from "./Logo";
import { Navigation } from "./Navigation";

export function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Logo />
        <Navigation className="desktop-nav" label="Navigation principale" />
        <Link className="header-cta" href="/reservation">{siteContent.labels.book}</Link>
        <details className="mobile-menu">
          <summary>Menu</summary>
          <Navigation className="mobile-nav" label="Navigation mobile" />
        </details>
      </div>
    </header>
  );
}
