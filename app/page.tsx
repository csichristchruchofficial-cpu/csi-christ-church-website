import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ServiceTimes from "@/components/ServiceTimes";
import SermonsSection from "@/components/SermonsSection";
import GallerySection from "@/components/GallerySection";
import MinistriesSection from "@/components/MinistriesSection";
import ContactSection from "@/components/ContactSection";
import ChurchUpdates from "@/components/ChurchUpdates";
import BirthdayAnniversarySection from "@/components/BirthdayAnniversarySection";
import { churchUpdates } from "@/data/updates";

export default function HomePage() {
  return (
    <>
      <Hero>
        <ChurchUpdates initialUpdates={churchUpdates} />
      </Hero>
      <BirthdayAnniversarySection />
      <AboutSection />
      <ServiceTimes />
      <SermonsSection />
      <GallerySection />
      <MinistriesSection />
      <ContactSection />
    </>
  );
}
