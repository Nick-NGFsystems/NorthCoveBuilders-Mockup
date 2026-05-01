"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// ── Icons ────────────────────────────────────────────────────────────────────

const icons = [
  // 1 Price Planning — dollar tag
  <svg key="1" viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  // 2 Secure a Home Site — map pin
  <svg key="2" viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2"/>
  </svg>,
  // 3 Design — pencil ruler
  <svg key="3" viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  // 4 Finishes — paint palette
  <svg key="4" viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10c0 1.657-1.343 3-3 3h-1.5a1.5 1.5 0 0 0 0 3 1 1 0 0 1 0 2c-3.04 0-5-1.343-5-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8.5" cy="10.5" r="1.5" fill="currentColor"/>
    <circle cx="12" cy="7" r="1.5" fill="currentColor"/>
    <circle cx="15.5" cy="10.5" r="1.5" fill="currentColor"/>
  </svg>,
  // 5 Construction — hard hat
  <svg key="5" viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
    <path d="M2 18h20M12 2v6M6 8a6 6 0 0 1 12 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="2" y="15" width="20" height="3" rx="1.5" stroke="currentColor" strokeWidth="2"/>
  </svg>,
  // 6 After Move-in — house key
  <svg key="6" viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
];

const heroStats = [
  { value: "6", label: "Clear Steps" },
  { value: "1-Year", label: "Home Warranty" },
  { value: "100%", label: "Transparent Pricing" },
];

type Step = { title: string; body: string };

// ── Desktop grid card ────────────────────────────────────────────────────────

function DesktopGridCard({ step, index, stepLabel }: { step: Step; index: number; stepLabel: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
      className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
          {icons[index] ?? null}
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-brand/60">
          {stepLabel} {index + 1}
        </span>
      </div>
      <h3
        data-ngf-field={`process.steps.${index}.title`}
        data-ngf-label="Step Title"
        data-ngf-type="text"
        data-ngf-section="Process"
        className="mt-3 text-lg font-semibold text-foreground"
      >
        {step.title}
      </h3>
      <p
        data-ngf-field={`process.steps.${index}.body`}
        data-ngf-label="Step Body"
        data-ngf-type="textarea"
        data-ngf-section="Process"
        className="mt-2 text-sm leading-7 text-foreground/70"
      >
        {step.body}
      </p>
    </motion.div>
  );
}

// ── Mobile StepCard ───────────────────────────────────────────────────────────

function StepCard({
  step, index, stepLabel, isInView,
}: {
  step: Step; index: number; stepLabel: string; isInView: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-6 shadow-sm transition-shadow duration-300 ${
        isInView ? "border-brand/20 shadow-md" : "border-black/5"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
          isInView ? "bg-brand text-white" : "bg-brand/10 text-brand"
        }`}>
          {icons[index] ?? null}
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-brand/60">
          {stepLabel} {index + 1}
        </span>
      </div>
      <h3
        data-ngf-field={`process.steps.${index}.title`}
        data-ngf-label="Step Title"
        data-ngf-type="text"
        data-ngf-section="Process"
        className="mt-3 text-lg font-semibold text-foreground"
      >
        {step.title}
      </h3>
      <p
        data-ngf-field={`process.steps.${index}.body`}
        data-ngf-label="Step Body"
        data-ngf-type="textarea"
        data-ngf-section="Process"
        className="mt-2 text-sm leading-7 text-foreground/70"
      >
        {step.body}
      </p>
    </div>
  );
}

// ── Mobile step row ───────────────────────────────────────────────────────────

function MobileStepRow({ step, index, stepLabel }: { step: Step; index: number; stepLabel: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-20% 0px -20% 0px" });

  return (
    <motion.div
      id={`step-mobile-${index}`}
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="flex gap-4"
    >
      {/* Circle + connector */}
      <div className="flex flex-col items-center">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-white transition-colors duration-300 ${
          isInView ? "bg-brand shadow-lg" : "bg-brand/60"
        }`}>
          {index + 1}
        </div>
        <div className="mt-2 flex-1 w-px bg-brand/20" />
      </div>

      {/* Card */}
      <div className="pb-8 flex-1 min-w-0">
        <StepCard step={step} index={index} stepLabel={stepLabel} isInView={isInView} />
      </div>
    </motion.div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function ProcessTimeline({
  steps,
  eyebrow,
  heading,
  intro,
  stepsHeading,
  stepLabelPrefix,
  ctaHeading,
  ctaBody,
  ctaButton,
}: {
  steps: Step[];
  eyebrow: string;
  heading: string;
  intro: string;
  stepsHeading: string;
  stepLabelPrefix: string;
  ctaHeading: string;
  ctaBody: string;
  ctaButton: string;
}) {


  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-brand pb-16 pt-40 md:pt-[8.5rem]">
        <div className="section-shell">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            data-ngf-field="process.eyebrow"
            data-ngf-label="Eyebrow"
            data-ngf-type="text"
            data-ngf-section="Process"
            className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-white/60 md:text-left"
          >
            {eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            data-ngf-field="process.heading"
            data-ngf-label="Heading"
            data-ngf-type="text"
            data-ngf-section="Process"
            className="mt-3 text-center text-3xl text-white sm:text-4xl md:text-left md:text-5xl"
          >
            {heading}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            data-ngf-field="process.intro"
            data-ngf-label="Intro Paragraph"
            data-ngf-type="textarea"
            data-ngf-section="Process"
            className="mt-4 text-center text-lg text-white/75 md:max-w-2xl md:text-left"
          >
            {intro}
          </motion.p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-4">
            {heroStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur-sm"
              >
                <p className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs font-medium text-white/70 sm:text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

{/* ── Timeline ── */}
      <section className="section-shell py-16">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          data-ngf-field="process.stepsHeading"
          data-ngf-label="Steps Section Heading"
          data-ngf-type="text"
          data-ngf-section="Process"
          className="mb-12 text-center text-2xl text-brand sm:text-3xl md:text-left"
        >
          {stepsHeading}
        </motion.h2>

        {/* ── Desktop grid ── */}
        <div
          className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ngf-group="process.steps"
          data-ngf-item-label="Process Step"
          data-ngf-min-items="1"
          data-ngf-max-items="12"
          data-ngf-item-fields='[{"key":"title","label":"Step Title","type":"text"},{"key":"body","label":"Step Body","type":"textarea"}]'
        >
          {steps.map((step, i) => (
            <DesktopGridCard
              key={i}
              step={step}
              index={i}
              stepLabel={stepLabelPrefix}
            />
          ))}
        </div>

        {/* ── Mobile timeline ── */}
        <div
          className="md:hidden"
          data-ngf-group="process.steps"
          data-ngf-item-label="Process Step"
          data-ngf-min-items="1"
          data-ngf-max-items="12"
          data-ngf-item-fields='[{"key":"title","label":"Step Title","type":"text"},{"key":"body","label":"Step Body","type":"textarea"}]'
        >
          {steps.map((step, i) => (
            <MobileStepRow
              key={i}
              step={step}
              index={i}
              stepLabel={stepLabelPrefix}
            />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-surface pb-8">
        <div className="section-shell">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl bg-brand p-8 text-center sm:p-12"
          >
            {/* Decorative circles */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
              <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/5" />
            </div>
            <div className="relative">
              <h2
                data-ngf-field="process.ctaHeading"
                data-ngf-label="CTA Heading"
                data-ngf-type="text"
                data-ngf-section="Process"
                className="text-2xl text-white sm:text-3xl"
              >
                {ctaHeading}
              </h2>
              <p
                data-ngf-field="process.ctaBody"
                data-ngf-label="CTA Body"
                data-ngf-type="textarea"
                data-ngf-section="Process"
                className="mx-auto mt-4 max-w-xl text-white/80"
              >
                {ctaBody}
              </p>
              <Link
                href="/contact"
                data-ngf-field="process.ctaButton"
                data-ngf-label="CTA Button"
                data-ngf-type="text"
                data-ngf-section="Process"
                className="mt-6 inline-block rounded-full bg-white px-8 py-3 font-semibold text-brand transition hover:bg-white/90"
              >
                {ctaButton}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
