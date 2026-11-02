import Link from "next/link";
import { siteContent } from "@/content/site";

export function MobileBookingBar() {
  return <div className="mobile-booking-bar"><Link href="/reservation">{siteContent.labels.book}</Link></div>;
}
