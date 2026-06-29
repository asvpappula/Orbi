import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Mockup, MockupFrame } from "@/components/ui/mockup";
import { Glow } from "@/components/ui/glow";

interface HeroWithMockupProps {
  title: string;
  description: string;
  primaryCta?: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  mockupImage?: { src: string; alt: string; width: number; height: number };
  children?: React.ReactNode;
  className?: string;
}

export function HeroWithMockup({
  title,
  description,
  primaryCta = { text: "Get Started", href: "#" },
  secondaryCta,
  mockupImage,
  children,
  className,
}: HeroWithMockupProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-background text-foreground",
        "px-4 py-16 sm:py-24 md:py-32",
        className,
      )}
    >
      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 lg:gap-16">
        <div className="relative z-10 flex flex-col items-center gap-6 pt-8 text-center sm:gap-8">
          <h1 className="relative z-10 inline-block max-w-4xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-4xl font-black leading-[1.1] tracking-tight text-transparent sm:text-6xl md:text-7xl">
            {title}
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
            {description}
          </p>
          <div className="relative z-10 flex flex-wrap justify-center gap-4">
            {primaryCta && (
              <Button asChild size="lg" variant="glow">
                <a href={primaryCta.href}>{primaryCta.text}</a>
              </Button>
            )}
            {secondaryCta && (
              <Button asChild size="lg" variant="ghost">
                <a href={secondaryCta.href}>{secondaryCta.text}</a>
              </Button>
            )}
          </div>
        </div>

        <div className="relative w-full">
          <MockupFrame
            className="animate-appear opacity-0 [animation-delay:700ms]"
            size="small"
          >
            <Mockup type="responsive" className="w-full">
              {children ?? (
                <img
                  // eslint-disable-next-line @next/next/no-img-element
                  {...mockupImage!}
                  className="h-auto w-full"
                  loading="lazy"
                />
              )}
            </Mockup>
          </MockupFrame>
          <Glow
            variant="top"
            className="animate-appear-zoom opacity-0 [animation-delay:1000ms]"
          />
        </div>
      </div>
    </section>
  );
}
