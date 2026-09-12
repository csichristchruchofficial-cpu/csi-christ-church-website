import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ServiceTimes from "@/components/ServiceTimes";
import SermonsSection from "@/components/SermonsSection";
import MinistriesSection from "@/components/MinistriesSection";
import EventsSection from "@/components/EventsSection";
import ContactSection from "@/components/ContactSection";
import ChurchUpdates from "@/components/ChurchUpdates";
import { churchUpdates } from "@/data/updates";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <ServiceTimes />
      <ChurchUpdates initialUpdates={churchUpdates} />
      <SermonsSection />
      <MinistriesSection />
      <EventsSection />
      <ContactSection />
    </>
  );
}
