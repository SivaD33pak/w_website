import WeddingNav from "@/components/WeddingNav";
import HeroSection from "@/components/HeroSection";
import TornPaper from "@/components/TornPaper";
import CountdownSection from "@/components/CountdownSection";
import EventsSection from "@/components/EventsSection";
import BibleVerseSection from "@/components/BibleVerseSection";
import RSVPSection from "@/components/RSVPSection";
import ContactSection from "@/components/ContactSection";
import WeddingFooter from "@/components/WeddingFooter";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <WeddingNav />

      <HeroSection />

      <TornPaper />

      <CountdownSection />

      <TornPaper />

      <EventsSection />

      <BibleVerseSection />

      <RSVPSection />

      <ContactSection />

      <WeddingFooter />
    </main>
  );
}
