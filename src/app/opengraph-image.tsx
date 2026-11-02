import { ImageResponse } from "next/og";
import { siteContent } from "@/content/site";

export const alt = `${siteContent.brand.name}, ${siteContent.business.type} à ${siteContent.business.locationLabel}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#eeeeec", color: "#292929", padding: "64px", alignItems: "stretch", fontFamily: "Arial, sans-serif" }}>
      <div style={{ width: "100%", border: "2px solid #292929", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "52px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 2, textTransform: "uppercase" }}><span>{siteContent.brand.name}</span><span>{siteContent.business.locationLabel}</span></div>
        <div style={{ display: "flex", flexDirection: "column" }}>{siteContent.socialImage.headlineLines.map((line) => <span style={{ fontSize: 92, letterSpacing: -5, lineHeight: 1 }} key={line}>{line}</span>)}</div>
        <div style={{ display: "flex", fontSize: 20 }}>{siteContent.contact.addressLines[0]} · {siteContent.contact.phone}</div>
      </div>
    </div>,
    size,
  );
}
