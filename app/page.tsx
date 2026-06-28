import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";
import { Problem } from "@/components/landing/Problem";
import { Testimonials } from "@/components/landing/Testimonials";
import { WaitlistCTA } from "@/components/landing/WaitlistCTA";

export default function Home() {
  return (
    <div className="overflow-clip bg-white">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Features />
        <Testimonials />
        <WaitlistCTA />
      </main>
      <Footer />
    </div>
  );
}
