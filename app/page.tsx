import { AIReplies } from "@/components/landing/AIReplies";
import { ContextFeature } from "@/components/landing/ContextFeature";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";
import { Pricing } from "@/components/landing/Pricing";
import { Problem } from "@/components/landing/Problem";
import { WaitlistCTA } from "@/components/landing/WaitlistCTA";

export default function Home() {
  return (
    <div className="overflow-clip">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <div id="features" className="scroll-mt-28">
          <ContextFeature />
        </div>
        <div id="how" className="scroll-mt-28">
          <AIReplies />
        </div>
        <Pricing />
        <WaitlistCTA />
      </main>
      <Footer />
    </div>
  );
}
