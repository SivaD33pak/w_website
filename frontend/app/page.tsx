import WeddingNav from "@/components/WeddingNav";
import HeroSection from "@/components/HeroSection";
import CountdownSection from "@/components/CountdownSection";
import EventsSection from "@/components/EventsSection";
import RSVPSection from "@/components/RSVPSection";
import WeddingFooter from "@/components/WeddingFooter";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <WeddingNav />

      <HeroSection />

      <CountdownSection />

      <EventsSection />

      <RSVPSection />

      <WeddingFooter />
    </main>
  );
}
