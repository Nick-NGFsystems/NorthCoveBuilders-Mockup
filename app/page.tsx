import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ReviewsCarousel } from "@/components/sections/ReviewsCarousel";
import { featuredProjects } from "@/lib/site-data";
import { getNgfContent } from "@/lib/ngf";

export const metadata: Metadata = {
  title: "Custom Home Builder in West Michigan",
  description:
    "North Cove Builders designs and builds custom homes across West Michigan with transparent pricing, personal service, and a clear process from concept to completion.",
};

export default async function Home() {
  const content = await getNgfContent()

  // ── Brand ──────────────────────────────────────────────────────────────────
  const businessName = content['brand.businessName'] || 'North Cove Builders'
  const serviceArea  = content['brand.serviceArea'] || 'West Michigan'

  // ── Hero ───────────────────────────────────────────────────────────────────
  const heroEyebrow    = content['hero.eyebrow'] || `${businessName} - ${serviceArea}`
  const heroHeadline   = content['hero.headline'] || "Build the home you've always dreamed of."
  const heroSubheadline = content['hero.subheadline'] || 'Custom Designs. Straightforward Pricing. A Clear & Precise Process.'
  const heroCta        = content['hero.cta'] || "Let's connect!"

  // ── About ──────────────────────────────────────────────────────────────────
  const aboutTitle  = content['about.title'] || "You'll feel at home long before you move in."
  const aboutBody1  = content['about.body1'] || "We pride ourselves in our dedication to making your home building experience a great one. Good communication is the foundation of our building process, and your involvement and satisfaction is our #1 concern."
  const aboutBody2  = content['about.body2'] || "Working with a builder you trust is key to limiting the stress of building a new home. Our transparent pricing structure, thorough process, and commitment to service are the key elements of our success."

  // ── Projects ───────────────────────────────────────────────────────────────
  const projectsTitle = content['projects.title'] || 'Featured Projects'
  const projectsViewAll = content['projects.viewAll'] || 'View All Work'

  // ── Reviews ───────────────────────────────────────────────────────────────
  const reviewsTitle = content['reviews.title'] || 'What Homeowners Are Saying'

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[78vh] overflow-hidden pt-28 text-white md:pt-24">
        <img
          src={content['hero.image'] || '/projects/001.jpg'}
          alt="Featured North Cove Builders custom home"
          data-ngf-field="hero.image"
          data-ngf-label="Hero Background Image"
          data-ngf-type="image"
          data-ngf-section="Hero"
          className="absolute inset-0 h-full w-full origin-top object-cover object-[73%_top] md:object-top"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="section-shell relative z-10 flex min-h-[78vh] items-end pb-12 md:items-end">
          <Reveal>
            <div className="mx-auto w-full max-w-2xl space-y-6 text-center md:mx-0 md:text-left">
              <p
                data-ngf-field="hero.eyebrow"
                data-ngf-label="Eyebrow Text"
                data-ngf-type="text"
                data-ngf-section="Hero"
                className="text-sm font-semibold uppercase tracking-[0.2em] text-white/85"
              >
                {heroEyebrow}
              </p>
              <h1
                data-ngf-field="hero.headline"
                data-ngf-label="Headline"
                data-ngf-type="text"
                data-ngf-section="Hero"
                className="text-3xl leading-tight sm:text-4xl md:text-6xl"
              >
                {heroHeadline}
              </h1>
              <p
                data-ngf-field="hero.subheadline"
                data-ngf-label="Subheadline"
                data-ngf-type="text"
                data-ngf-section="Hero"
                className="max-w-2xl text-base text-white/90 sm:text-lg"
              >
                {heroSubheadline}
              </p>
              <Link
                href="/contact"
                data-ngf-field="hero.cta"
                data-ngf-label="Button Text"
                data-ngf-type="text"
                data-ngf-section="Hero"
                className="btn-brand"
              >
                {heroCta}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── About ── */}
      <section className="section-shell">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2
              data-ngf-field="about.title"
              data-ngf-label="Section Title"
              data-ngf-type="text"
              data-ngf-section="About"
              className="text-2xl text-brand sm:text-3xl md:text-4xl"
            >
              {aboutTitle}
            </h2>
            <p
              data-ngf-field="about.body1"
              data-ngf-label="First Paragraph"
              data-ngf-type="textarea"
              data-ngf-section="About"
              className="mt-4 text-lg text-foreground/80"
            >
              {aboutBody1}
            </p>
            <p
              data-ngf-field="about.body2"
              data-ngf-label="Second Paragraph"
              data-ngf-type="textarea"
              data-ngf-section="About"
              className="mt-4 text-lg text-foreground/80"
            >
              {aboutBody2}
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── Featured Projects ── */}
      <section className="bg-surface">
        <div className="section-shell">
          <Reveal>
            <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
              <h2
                data-ngf-field="projects.title"
                data-ngf-label="Section Title"
                data-ngf-type="text"
                data-ngf-section="Projects"
                className="text-2xl text-brand sm:text-3xl"
              >
                {projectsTitle}
              </h2>
              <Link
                href="/our-work"
                className="inline-flex items-center rounded-full border border-brand/20 bg-white px-4 py-2 text-sm font-semibold text-brand shadow-sm transition hover:-translate-y-0.5 hover:bg-brand hover:text-white"
                data-ngf-field="projects.viewAll"
                data-ngf-label="View All Button"
                data-ngf-type="text"
                data-ngf-section="Projects"
              >
                {projectsViewAll}
              </Link>
            </div>
          </Reveal>
          <div
            className="grid gap-6 md:grid-cols-3"
            data-ngf-group="projects.featured"
            data-ngf-item-label="Featured Project"
            data-ngf-min-items="0"
            data-ngf-max-items="6"
            data-ngf-item-fields='[{"key":"image","label":"Project Image","type":"image"},{"key":"name","label":"Project Name","type":"text"},{"key":"ctaLabel","label":"Link Label","type":"text"}]'
          >
            {featuredProjects.slice(0, 3).map((project, idx) => {
              const name = content[`projects.featured.${idx}.name`] || project.name
              const ctaLabel = content[`projects.featured.${idx}.ctaLabel`] || 'View on Houzz'
              const image = content[`projects.featured.${idx}.image`] || project.image
              return (
              <Reveal key={project.name}>
                <article className="overflow-hidden rounded-2xl bg-white">
                  <Link href={project.houzzUrl} target="_blank" rel="noreferrer" className="block">
                    <div className="relative h-60">
                      {/* next/image with `fill` doesn't expose a direct <img>,
                          so we use a plain <img> here so the bridge can read
                          and write the src directly. */}
                      <img
                        src={image}
                        alt={name}
                        data-ngf-field={`projects.featured.${idx}.image`}
                        data-ngf-label="Project Image"
                        data-ngf-type="image"
                        data-ngf-section="Projects"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-5 text-center">
                      <h3
                        data-ngf-field={`projects.featured.${idx}.name`}
                        data-ngf-label="Project Name"
                        data-ngf-type="text"
                        data-ngf-section="Projects"
                        className="text-xl text-brand"
                      >
                        {name}
                      </h3>
                    </div>
                  </Link>
                  <div className="px-5 pb-5 text-center">
                    <Link href={project.houzzUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-brand hover:underline">
                      <span
                        data-ngf-field={`projects.featured.${idx}.ctaLabel`}
                        data-ngf-label="Link Label"
                        data-ngf-type="text"
                        data-ngf-section="Projects"
                      >
                        {ctaLabel}
                      </span>
                    </Link>
                  </div>
                </article>
              </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="section-shell">
        <Reveal>
          <h2
            data-ngf-field="reviews.title"
            data-ngf-label="Section Title"
            data-ngf-type="text"
            data-ngf-section="Reviews"
            className="mb-8 text-center text-2xl text-brand sm:text-3xl"
          >
            {reviewsTitle}
          </h2>
        </Reveal>
        <Reveal>
          <div className="px-5">
            <ReviewsCarousel content={content} />
          </div>
        </Reveal>
      </section>

      {/* Hidden brand anchors for portal editor */}
      <span
        data-ngf-field="brand.businessName"
        data-ngf-label="Business Name"
        data-ngf-type="text"
        data-ngf-section="Brand"
        aria-hidden="true"
        className="sr-only"
      />
      <span
        data-ngf-field="brand.serviceArea"
        data-ngf-label="Service Area"
        data-ngf-type="text"
        data-ngf-section="Brand"
        aria-hidden="true"
        className="sr-only"
      />
    </>
  );
}
