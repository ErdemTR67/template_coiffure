import { About } from "@/components/sections/About";
import { BookingCallout } from "@/components/sections/BookingCallout";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Hours } from "@/components/sections/Hours";
import { Practical } from "@/components/sections/Practical";
import { Services } from "@/components/sections/Services";

export default function Home() {
  return (
    <main id="contenu" className="home-page">
      <Hero />
      <About />
      <Services />
      <BookingCallout />
      <Practical />
      <Hours />
      <Contact />
    </main>
  );
}
