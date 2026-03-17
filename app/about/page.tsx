"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { teamMembers } from "@/lib/site-data";

const processSteps = [
  {
    title: "Price Planning",
    body: "Upfront and transparent pricing from the beginning. In your 1-hour consultation, you receive a customized itemized quote and interactive pricing tool. No floor plans needed—just bring your ideas.",
  },
  {
    title: "Secure a Home Site",
    body: "If you already own property, great. If not, we help identify options through local relationships and area knowledge. We also provide a complimentary site assessment to review prep work and costs.",
  },
  {
    title: "Design Your Custom Home Plan",
    body: "Design a plan that fits your lifestyle and budget. We can customize existing floor plans or help you create your dream home from scratch.",
  },
  {
    title: "Choose Your Finishes & Colors",
    body: "With our design team, you select interior and exterior finishes that make your house feel like home. Work with trusted vendors or bring your own favorites.",
  },
  {
    title: "Construction",
    body: "Our in-house carpentry crews support consistency in quality and schedule. You’ll have key on-site meetings plus regular updates on milestones, progress photos, and timelines.",
  },
  {
    title: "After You Move In",
    body: "Every new home includes a full 1-year warranty and a 30-day touch-up appointment to handle dents or dings from move-in.",
  },
];

export default function AboutPage() {
  const [expandedBios, setExpandedBios] = useState<Record<string, boolean>>({});

  return (
    <>
      <section className="bg-surface">
        <div className="section-shell !pt-40 pb-4 md:!pt-[8.5rem]">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.15em] text-brand md:text-left">About North Cove Builders</p>
          <h1 className="mt-3 text-center text-3xl text-brand sm:text-4xl md:text-left md:text-5xl">A personal builder experience from first conversation to final walkthrough.</h1>
        </div>
      </section>

      <section id="team" className="bg-surface scroll-mt-28">
        <div className="section-shell !pt-6 md:!pt-8">
          <Reveal>
            <h2 className="mb-8 text-center text-2xl text-brand sm:text-3xl md:text-left">Meet the Team</h2>
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-2">
            {teamMembers.map((member, index) => (
              <Reveal key={member.name}>
                <article className="rounded-2xl bg-white p-4 sm:p-5 lg:h-full lg:p-6">
                  <div className="flex items-start gap-4 lg:flex-col lg:items-center lg:gap-5 lg:text-center">
                    <div className="relative h-44 w-32 shrink-0 overflow-hidden rounded-xl sm:h-48 sm:w-36 lg:h-56 lg:w-44">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      priority={index === 0}
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-top"
                    />
                    </div>
                    <div className="min-w-0 text-left lg:text-center">
                      <h3 className="text-lg text-brand sm:text-xl">{member.name}</h3>
                      <p className="mt-1 text-sm text-foreground/70">{member.role}</p>
                      <p className="mt-3 text-sm leading-7 text-foreground/80 md:hidden">
                        {expandedBios[member.name]
                          ? member.bio
                          : `${member.bio.slice(0, 180).trimEnd()}${member.bio.length > 180 ? "..." : ""}`}
                      </p>
                      <p className="mt-3 hidden text-sm leading-7 text-foreground/80 md:block">{member.bio}</p>
                      {member.bio.length > 180 ? (
                        <button
                          type="button"
                          className="mt-2 text-sm font-semibold text-brand hover:underline md:hidden"
                          onClick={() =>
                            setExpandedBios((previous) => ({
                              ...previous,
                              [member.name]: !previous[member.name],
                            }))
                          }
                        >
                          {expandedBios[member.name] ? "Show less" : "Read more"}
                        </button>
                      ) : null}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="values" className="section-shell scroll-mt-28">
        <Reveal>
          <h2 className="text-center text-2xl text-brand sm:text-3xl md:text-left">Mission & Values</h2>
          <p className="mt-4 text-center leading-8 text-foreground/80 md:text-left">
            We love what we do! Everything we do is to ensure your building experience is enjoyable and that your new home is everything you&apos;ve dreamt it would be.
          </p>
          <p className="mt-3 text-center leading-8 text-foreground/80 md:text-left">
            We keep God and our values at the forefront of everything we do.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-3 md:hidden">
          <Reveal>
            <details className="rounded-2xl border border-black/5 bg-white p-4">
              <summary className="accordion-summary flex cursor-pointer list-none items-center justify-between gap-3 text-left">
                <span className="text-lg font-semibold text-brand">Core Values</span>
                <span className="accordion-chevron text-brand">▾</span>
              </summary>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-foreground/80">
                <li>Family is first. Ours. Yours. Always!</li>
                <li>We treat everyone fairly, with honesty and respect.</li>
                <li>We build trust by acting with compassion and others&apos; best interest in mind.</li>
                <li>Our team is built on positivity, hard work, and reliability.</li>
              </ul>
            </details>
          </Reveal>

          <Reveal>
            <details className="rounded-2xl border border-black/5 bg-white p-4">
              <summary className="accordion-summary flex cursor-pointer list-none items-center justify-between gap-3 text-left">
                <span className="text-lg font-semibold text-brand">Design Support</span>
                <span className="accordion-chevron text-brand">▾</span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-foreground/80">
                Bring your dream home to life with one-on-one design help and hand-picked products tailored to your style, space, and budget.
              </p>
            </details>
          </Reveal>
        </div>

        <div className="mt-8 hidden gap-5 md:grid md:grid-cols-2">
          <Reveal>
            <article className="card-soft">
              <h3 className="text-center text-xl text-brand md:text-left">Core Values</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-foreground/80">
                <li>Family is first. Ours. Yours. Always!</li>
                <li>We treat everyone fairly, with honesty and respect.</li>
                <li>We build trust by acting with compassion and others&apos; best interest in mind.</li>
                <li>Our team is built on positivity, hard work, and reliability.</li>
              </ul>
            </article>
          </Reveal>
          <Reveal>
            <article className="card-soft">
              <h3 className="text-center text-xl text-brand md:text-left">Design Support</h3>
              <p className="mt-3 text-sm leading-7 text-foreground/80">
                Bring your dream home to life with one-on-one design help and hand-picked products tailored to your style, space, and budget.
              </p>
            </article>
          </Reveal>
        </div>
      </section>

      <section id="process" className="bg-surface scroll-mt-28">
        <div className="section-shell">
          <Reveal>
            <h2 className="mb-8 text-center text-2xl text-brand sm:text-3xl md:text-left">Our Process</h2>
          </Reveal>

          <div className="grid gap-3 md:hidden">
            {processSteps.map((step, index) => (
              <Reveal key={step.title}>
                <details className="rounded-2xl border border-black/5 bg-white p-4">
                  <summary className="accordion-summary cursor-pointer list-none text-left">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand">Step {index + 1}</p>
                        <p className="mt-1 text-base font-semibold text-foreground">{step.title}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-brand/70">Tap to expand</p>
                      </div>
                      <span className="accordion-chevron mt-1 text-brand">▾</span>
                    </div>
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-foreground/80">{step.body}</p>
                </details>
              </Reveal>
            ))}
          </div>

          <ol className="hidden gap-4 md:grid md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((step, index) => (
              <Reveal key={step.title}>
                <li className="card-soft h-full flex flex-col text-center md:text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand">Step {index + 1}</p>
                  <p className="mt-2 text-lg text-foreground">{step.title}</p>
                  <p className="mt-3 flex-1 text-sm leading-7 text-foreground/80">{step.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
