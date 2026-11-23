import React from "react";
import TopBar from "@/components/chema/TopBar";
import ChemHeader from "@/components/chema/ChemHeader";
import ChemHero from "@/components/chema/ChemHero";
import ChemEffects from "@/components/chema/ChemEffects";
import SolutionsTabs from "@/components/chema/SolutionsTabs";
import Approach360 from "@/components/chema/Approach360";
import StatsBar from "@/components/chema/StatsBar";
import StickyRail from "@/components/chema/StickyRail";
import FooterChem from "@/components/chema/FooterChem";
import About from "@/components/About";
import WaterChallenges from "@/components/WaterChallenges";
import HowWeWork from "@/components/HowWeWork";
import Projects from "@/components/Projects";
import Equipment from "@/components/Equipment";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <main className="min-h-screen bg-warm-white flex flex-col font-sans">
      <ChemEffects />
      <TopBar />
      <ChemHeader />
      <ChemHero />
      <About />
      <WaterChallenges />
      <SolutionsTabs />
      <Approach360 />
      <StatsBar />
      <HowWeWork />
      <Projects />
      <Equipment />
      <Faq />
      <Contact />
      <FooterChem />
      <StickyRail />
      <WhatsAppButton />
    </main>
  );
}
