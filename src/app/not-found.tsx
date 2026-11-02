import Link from "next/link";
import { siteContent } from "@/content/site";

export default function NotFound() {
  const content = siteContent.pages.notFound;
  return <main id="contenu" className="not-found section-shell"><p className="not-found-code" aria-hidden="true">404</p><div><p className="eyebrow">{content.eyebrow}</p><h1>{content.title}</h1><p>{content.text}</p><div className="button-row" style={{ marginLeft: 0 }}><Link className="button button-primary" href="/">{siteContent.labels.backHome}</Link><Link className="text-link" href="/reservation">{siteContent.labels.book}</Link></div></div></main>;
}
