import Link from "next/link";
import { siteContent } from "@/content/site";

export function Navigation({ className, label }: { className: string; label: string }) {
  return (
    <nav className={className} aria-label={label}>
      {siteContent.navigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
    </nav>
  );
}
