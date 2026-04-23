import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { floorPlans, toSlug } from "@/lib/site-data";
import { getNgfContent } from "@/lib/ngf";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return floorPlans.map((plan) => ({ slug: toSlug(plan.name) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const plan = floorPlans.find((p) => toSlug(p.name) === slug);
  if (!plan) return {};
  return {
    title: plan.name,
    description: `${plan.name} — ${plan.homeType} home with ${plan.squareFeet.toLocaleString()} sq ft, ${plan.bedrooms} bedrooms, ${plan.baths} baths, and ${plan.garageStalls}-stall garage. Built by North Cove Builders.`,
  };
}

export default async function FloorPlanDetailPage({ params }: Props) {
  const { slug } = await params;
  const plan = floorPlans.find((p) => toSlug(p.name) === slug);

  if (!plan) notFound();

  const content = await getNgfContent()

  // Per-plan editable overrides
  const planName = content[`floorPlans.detail.${slug}.name`] || plan.name
  const planType = content[`floorPlans.detail.${slug}.type`] || plan.homeType

  const backLabel = content['floorPlans.detail.backLabel'] || 'All Floor Plans'
  const detailsHeading = content['floorPlans.detail.detailsHeading'] || 'Plan Details'
  const floorPlanHeading = content['floorPlans.detail.floorPlanHeading'] || 'Floor Plan'
  const comingSoonMain = content['floorPlans.detail.comingSoon'] || 'Floor plan coming soon'
  const comingSoonSub = content['floorPlans.detail.comingSoonSub'] || 'Contact us to request a copy'
  const ctaHeading = content['floorPlans.detail.ctaHeading'] || 'Interested in this plan?'
  const ctaBody = content['floorPlans.detail.ctaBody'] || "Every home we build is customized to fit your lifestyle. Start with this plan and we'll tailor it to your needs, lot, and style."
  const ctaPrimary = content['floorPlans.detail.ctaPrimary'] || "Let's talk"
  const ctaSecondary = content['floorPlans.detail.ctaSecondary'] || 'Browse all plans'

  const statLabels = {
    homeType:     content['floorPlans.detail.labels.homeType']     || 'Home Type',
    squareFeet:   content['floorPlans.detail.labels.squareFeet']   || 'Sq. Feet',
    bedrooms:     content['floorPlans.detail.labels.bedrooms']     || 'Bedrooms',
    baths:        content['floorPlans.detail.labels.baths']        || 'Baths',
    garageStalls: content['floorPlans.detail.labels.garageStalls'] || 'Garage Stalls',
  }

  const stats = [
    { key: 'homeType',     label: statLabels.homeType,     value: planType },
    { key: 'squareFeet',   label: statLabels.squareFeet,   value: plan.squareFeet.toLocaleString() },
    { key: 'bedrooms',     label: statLabels.bedrooms,     value: plan.bedrooms },
    { key: 'baths',        label: statLabels.baths,        value: plan.baths },
    { key: 'garageStalls', label: statLabels.garageStalls, value: plan.garageStalls },
  ];

  return (
    <section className="section-shell !pt-40 md:!pt-[8.5rem]">

      {/* Back link */}
      <Reveal>
        <Link
          href="/floor-plans"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand/70 hover:text-brand transition-colors"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
            <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span
            data-ngf-field="floorPlans.detail.backLabel"
            data-ngf-label="Back Link Label"
            data-ngf-type="text"
            data-ngf-section="Floor Plan Detail"
          >
            {backLabel}
          </span>
        </Link>
      </Reveal>

      {/* Header */}
      <Reveal>
        <div className="mt-6">
          <p
            data-ngf-field={`floorPlans.detail.${slug}.type`}
            data-ngf-label="Home Type"
            data-ngf-type="text"
            data-ngf-section="Floor Plan Detail"
            className="text-sm font-semibold uppercase tracking-[0.15em] text-brand"
          >
            {planType}
          </p>
          <h1
            data-ngf-field={`floorPlans.detail.${slug}.name`}
            data-ngf-label="Plan Name"
            data-ngf-type="text"
            data-ngf-section="Floor Plan Detail"
            className="mt-2 text-3xl text-brand sm:text-4xl md:text-5xl"
          >
            {planName}
          </h1>
        </div>
      </Reveal>

      {/* Main image */}
      <Reveal>
        <div className="mt-8 relative w-full overflow-hidden rounded-2xl bg-surface" style={{ aspectRatio: "16/9" }}>
          <Image
            src={plan.image}
            alt={planName}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
            priority
          />
        </div>
      </Reveal>

      {/* Stats — full width */}
      <Reveal>
        <div className="mt-10">
          <h2
            data-ngf-field="floorPlans.detail.detailsHeading"
            data-ngf-label="Details Heading"
            data-ngf-type="text"
            data-ngf-section="Floor Plan Detail"
            className="text-xl font-semibold text-brand"
          >
            {detailsHeading}
          </h2>
          <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {stats.map(({ key, label, value }) => (
              <div key={key} className="card-soft rounded-xl p-4 min-w-0">
                <dt
                  data-ngf-field={`floorPlans.detail.labels.${key}`}
                  data-ngf-label={`${label} Label`}
                  data-ngf-type="text"
                  data-ngf-section="Floor Plan Detail"
                  className="text-xs font-semibold uppercase tracking-[0.12em] text-brand/70 truncate"
                >
                  {label}
                </dt>
                <dd className="mt-1 text-lg font-semibold text-foreground break-words">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>

      {/* Floor plan — full width */}
      <Reveal>
        {plan.planUrl ? (
          <div className="mt-10">
            <h2
              data-ngf-field="floorPlans.detail.floorPlanHeading"
              data-ngf-label="Floor Plan Heading"
              data-ngf-type="text"
              data-ngf-section="Floor Plan Detail"
              className="text-xl font-semibold text-brand"
            >
              {floorPlanHeading}
            </h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-black/5 bg-surface">
              <iframe
                src={plan.planUrl}
                className="w-full"
                style={{ height: "600px" }}
                title={`${plan.name} floor plan`}
              />
            </div>
          </div>
        ) : (
          <div className="mt-10">
            <h2
              data-ngf-field="floorPlans.detail.floorPlanHeading"
              data-ngf-label="Floor Plan Heading"
              data-ngf-type="text"
              data-ngf-section="Floor Plan Detail"
              className="text-xl font-semibold text-brand"
            >
              {floorPlanHeading}
            </h2>
            <div className="mt-4 flex items-center justify-center rounded-2xl border-2 border-dashed border-brand/20 bg-surface py-16 text-center">
              <div>
                <p
                  data-ngf-field="floorPlans.detail.comingSoon"
                  data-ngf-label="Coming Soon Text"
                  data-ngf-type="text"
                  data-ngf-section="Floor Plan Detail"
                  className="text-sm font-medium text-foreground/60"
                >
                  {comingSoonMain}
                </p>
                <p
                  data-ngf-field="floorPlans.detail.comingSoonSub"
                  data-ngf-label="Coming Soon Subtext"
                  data-ngf-type="text"
                  data-ngf-section="Floor Plan Detail"
                  className="mt-1 text-xs text-foreground/40"
                >
                  {comingSoonSub}
                </p>
              </div>
            </div>
          </div>
        )}
      </Reveal>

      {/* CTA — full-width banner */}
      <Reveal>
        <div className="mt-10 card-soft rounded-2xl p-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3
              data-ngf-field="floorPlans.detail.ctaHeading"
              data-ngf-label="CTA Heading"
              data-ngf-type="text"
              data-ngf-section="Floor Plan Detail"
              className="text-lg font-semibold text-brand"
            >
              {ctaHeading}
            </h3>
            <p
              data-ngf-field="floorPlans.detail.ctaBody"
              data-ngf-label="CTA Body"
              data-ngf-type="textarea"
              data-ngf-section="Floor Plan Detail"
              className="mt-1 text-sm text-foreground/70 leading-relaxed max-w-xl"
            >
              {ctaBody}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end shrink-0">
            <Link href="/contact" className="btn-brand text-center whitespace-nowrap">
              <span
                data-ngf-field="floorPlans.detail.ctaPrimary"
                data-ngf-label="Primary CTA"
                data-ngf-type="text"
                data-ngf-section="Floor Plan Detail"
              >
                {ctaPrimary}
              </span>
            </Link>
            <Link
              href="/floor-plans"
              className="text-center text-sm font-medium text-brand/70 hover:text-brand transition-colors whitespace-nowrap"
            >
              <span
                data-ngf-field="floorPlans.detail.ctaSecondary"
                data-ngf-label="Secondary CTA"
                data-ngf-type="text"
                data-ngf-section="Floor Plan Detail"
              >
                {ctaSecondary}
              </span>
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
