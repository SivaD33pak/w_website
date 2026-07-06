"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import WelcomeScreen from "@/components/WelcomeScreen";
import WeddingNav from "@/components/WeddingNav";
import HeroSection from "@/components/HeroSection";
import CountdownSection from "@/components/CountdownSection";
import EventsSection from "@/components/EventsSection";
import RSVPSection from "@/components/RSVPSection";
import WeddingFooter from "@/components/WeddingFooter";

export default function HomePage() {
  // Welcome screen shows on every page load (per design choice — no
  // localStorage). The main site renders behind it so its first paint is
  // already warm when the welcome fades out.
  const [opened, setOpened] = useState(false);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <AnimatePresence mode="wait">
        {!opened && (
          <WelcomeScreen key="welcome" onOpen={() => setOpened(true)} />
        )}
      </AnimatePresence>

      <WeddingNav />

      <HeroSection />

      <CountdownSection />

      <EventsSection />

      <RSVPSection />

      <WeddingFooter />
    </main>
  );
}
