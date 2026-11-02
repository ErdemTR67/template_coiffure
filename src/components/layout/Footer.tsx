import Link from "next/link";
import { Logo } from "./Logo";
import { siteContent } from "@/content/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main section-shell">
        <div>
          <Logo />
          <p>{siteContent.footer.description}</p>
          <p>{siteContent.footer.servicesLine}</p>
          <p><a href={`tel:${siteContent.contact.phoneHref}`}>{siteContent.contact.phone}</a>{siteContent.contact.addressLines.map((line) => <span className="footer-address-line" key={line}>{line}</span>)}</p>
        </div>
        <div className="footer-column">
          <p className="footer-title">{siteContent.footer.exploreTitle}</p>
          {siteContent.footer.exploreLinks.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
        </div>
        <div className="footer-column">
          <p className="footer-title">{siteContent.footer.informationTitle}</p>
          {siteContent.footer.informationLinks.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
        </div>
      </div>
      <div className="footer-bottom section-shell">
        <p>© {new Date().getFullYear()} {siteContent.brand.name}</p>
      </div>
    </footer>
  );
}
