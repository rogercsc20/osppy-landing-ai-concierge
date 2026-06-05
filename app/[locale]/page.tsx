import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { SocialProofBar } from "@/components/sections/SocialProofBar";
import { Problem } from "@/components/sections/Problem";
import { Solution } from "@/components/sections/Solution";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Features } from "@/components/sections/Features";
import { BeachToDashboard } from "@/components/sections/BeachToDashboard";
import { Pricing } from "@/components/sections/Pricing";
import { PilotProof } from "@/components/sections/PilotProof";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SocialProofBar />
        <Problem />
        <Solution />
        <HowItWorks />
        <Features />
        <BeachToDashboard />
        <Pricing />
        <PilotProof />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
