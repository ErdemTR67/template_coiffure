import Link from "next/link";
import { displayBrandName } from "@/content/site";

export function Logo() {
  return (
    <Link className="logo" href="/" aria-label="Accueil">
      <span>{displayBrandName}</span>
    </Link>
  );
}
