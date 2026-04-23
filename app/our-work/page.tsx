import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { PortfolioFilterGrid } from "@/components/sections/PortfolioFilterGrid";
import { getNgfContent } from "@/lib/ngf";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Browse completed North Cove Builders homes. Each home begins with a vision and comes to life through thoughtful design, careful planning, and expert craftsmanship.",
};

export default async function OurWorkPage() {
  const content = await getNgfContent()

  const eyebrow = content['ourWork.eyebrow'] || 'Completed Project Portfolio'
  const heading = content['ourWork.heading'] || 'Our Work'
  const description = content['ourWork.description'] || 'Each home we build begins with a vision and comes to life through thoughtful design, careful planning, and expert craftsmanship.'

  return (
    <section className="section-shell !pt-40 md:!pt-[8.5rem]">
      <Reveal>
        <p
          data-ngf-field="ourWork.eyebrow"
          data-ngf-label="Eyebrow"
          data-ngf-type="text"
          data-ngf-section="OurWork"
          className="text-center text-sm font-semibold uppercase tracking-[0.15em] text-brand md:text-left"
        >
          {eyebrow}
        </p>
        <h1
          data-ngf-field="ourWork.heading"
          data-ngf-label="Heading"
          data-ngf-type="text"
          data-ngf-section="OurWork"
          className="mt-3 text-center text-3xl text-brand sm:text-4xl md:text-left md:text-5xl"
        >
          {heading}
        </h1>
        <p
          data-ngf-field="ourWork.description"
          data-ngf-label="Description"
          data-ngf-type="textarea"
          data-ngf-section="OurWork"
          className="mx-auto mt-4 max-w-2xl text-center text-foreground/80 md:mx-0 md:text-left"
        >
          {description}
        </p>
      </Reveal>

      <div className="mt-10">
        <PortfolioFilterGrid />
      </div>
    </section>
  );
}
