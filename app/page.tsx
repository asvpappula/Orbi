import { CardStack, type CardStackItem } from "@/components/ui/card-stack";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";
import { Problem } from "@/components/landing/Problem";
import { Testimonials } from "@/components/landing/Testimonials";
import { WaitlistCTA } from "@/components/landing/WaitlistCTA";

const ORBI_CARDS: CardStackItem[] = [
  {
    id: 1,
    title: "Unified Inbox",
    description: "Canvas, Gmail, Slack, Discord — one prioritized feed",
    imageSrc:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    href: "#waitlist",
  },
  {
    id: 2,
    title: "AI Reply Drafts",
    description: "Responds in your exact voice. You just confirm.",
    imageSrc:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
    href: "#waitlist",
  },
  {
    id: 3,
    title: "Canvas Assignments",
    description: "Every deadline pulled automatically. No token needed.",
    imageSrc:
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80",
    href: "#waitlist",
  },
  {
    id: 4,
    title: "Smart Calendar",
    description: "All deadlines and events in one visual week view.",
    imageSrc:
      "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&q=80",
    href: "#waitlist",
  },
  {
    id: 5,
    title: "Cross-App Context",
    description: "See the assignment, email, and chat thread together.",
    imageSrc:
      "https://images.unsplash.com/photo-1558591710-4b4a1ae0f665?w=800&q=80",
    href: "#waitlist",
  },
];

export default function Home() {
  return (
    <div className="overflow-clip bg-white">
      <Navbar />
      <main>
        <Hero />
        <section className="overflow-hidden py-24">
          <div className="mb-16 px-6 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-500">
              See it in action
            </p>
            <h2 className="text-4xl font-black tracking-[-0.04em] text-slate-950">
              Every view, one app.
            </h2>
          </div>
          <CardStack items={ORBI_CARDS} />
        </section>
        <Problem />
        <Features />
        <Testimonials />
        <WaitlistCTA />
      </main>
      <Footer />
    </div>
  );
}
