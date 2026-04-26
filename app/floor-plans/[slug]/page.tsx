import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { FloorPlanViewer } from "@/components/FloorPlanViewer";
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

  const content = await getNgfContent();

  const planDetailsHeading = content['floorPlanDetail.planDetailsHeading'] ?? 'Plan Details';
  const floorPlanHeading   = content['floorPlanDetail.floorPlanHeading']   ?? 'Floor Plan';
  const ctaHeading         = content['floorPlanDetail.ctaHeading']         ?? 'Interested in this plan?';
  const ctaBody            = content['floorPlanDetail.ctaBody']            ?? "Every home we build is customized to fit your lifestyle. Start with this plan and we'll tailor it to your needs, lot, and style.";
  const ctaButton          = content['floorPlanDetail.ctaButton']          ?? "Let's talk";
  const ctaSecondary       = content['floorPlanDetail.ctaSecondary']       ?? 'Browse all plans';

  const stats = [
    { label: "Sq. Feet", value: plan.squareFeet.toLocaleString() },
    { label: "Bedrooms", value: plan.bedrooms },
    { label: "Baths", value: plan.baths },
    { label: "Garage Stalls", value: plan.garageStalls },
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
          All Floor Plans
        </Link>
      </Reveal>

      {/* Header */}
      <Reveal>
        <div className="mt-6">
          <h1 className="mt-2 text-3xl text-brand sm:text-4xl md:text-5xl">{plan.name}</h1>
        </div>
      </Reveal>

      {/* Main image */}
      <Reveal>
        <div className="mt-8 relative w-full overflow-hidden rounded-2xl bg-surface" style={{ aspectRatio: "16/9" }}>
          <Image
            src={plan.image}
            alt={plan.name}
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
            data-ngf-field="floorPlanDetail.planDetailsHeading"
            data-ngf-label="Plan Details Heading"
            data-ngf-type="text"
            data-ngf-section="Floor Plan Detail"
            className="text-xl font-semibold text-brand"
          >
            {planDetailsHeading}
          </h2>
          <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map(({ label, value }) => (
              <div key={label} className="card-soft rounded-xl p-4 min-w-0">
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-brand/70 truncate">{label}</dt>
                <dd className="mt-1 text-lg font-semibold text-foreground break-words">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>

      {/* Floor plan — full width */}
      <Reveal>
        <div className="mt-10">
          <h2
            data-ngf-field="floorPlanDetail.floorPlanHeading"
            data-ngf-label="Floor Plan Heading"
            data-ngf-type="text"
            data-ngf-section="Floor Plan Detail"
            className="text-xl font-semibold text-brand"
          >
            {floorPlanHeading}
          </h2>
          {"planImages" in plan && plan.planImages && plan.planImages.length > 0 ? (
            <FloorPlanViewer
              images={plan.planImages}
              planName={plan.name}
              planPdf={"planPdf" in plan ? (plan.planPdf as string) : undefined}
            />
          ) : plan.planUrl ? (
            <div className="mt-4 overflow-hidden rounded-2xl border border-black/5 bg-surface">
              <iframe
                src={plan.planUrl}
                className="w-full"
                style={{ height: "600px" }}
                title={`${plan.name} floor plan`}
              />
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-center rounded-2xl border-2 border-dashed border-brand/20 bg-surface py-16 text-center">
              <div>
                <p className="text-sm font-medium text-foreground/60">Floor plan coming soon</p>
                <p className="mt-1 text-xs text-foreground/40">Contact us to request a copy</p>
              </div>
            </div>
          )}
        </div>
      </Reveal>

      {/* CTA — full-width banner */}
      <Reveal>
        <div className="mt-10 card-soft rounded-2xl p-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3
              data-ngf-field="floorPlanDetail.ctaHeading"
              data-ngf-label="CTA Heading"
              data-ngf-type="text"
              data-ngf-section="Floor Plan Detail"
              className="text-lg font-semibold text-brand"
            >
              {ctaHeading}
            </h3>
            <p
              data-ngf-field="floorPlanDetail.ctaBody"
              data-ngf-label="CTA Body Text"
              data-ngf-type="textarea"
              data-ngf-section="Floor Plan Detail"
              className="mt-1 text-sm text-foreground/70 leading-relaxed max-w-xl"
            >
              {ctaBody}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end shrink-0">
            <Link
              href="/contact"
              data-ngf-field="floorPlanDetail.ctaButton"
              data-ngf-label="CTA Button Text"
              data-ngf-type="text"
              data-ngf-section="Floor Plan Detail"
              className="btn-brand text-center whitespace-nowrap"
            >
              {ctaButton}
            </Link>
            <Link
              href="/floor-plans"
              data-ngf-field="floorPlanDetail.ctaSecondary"
              data-ngf-label="Secondary Link Text"
              data-ngf-type="text"
              data-ngf-section="Floor Plan Detail"
              className="text-center text-sm font-medium text-brand/70 hover:text-brand transition-colors whitespace-nowrap"
            >
              {ctaSecondary}
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
