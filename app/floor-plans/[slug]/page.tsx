import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { floorPlans, toSlug } from "@/lib/site-data";

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

  const stats = [
    { label: "Home Type", value: plan.homeType },
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
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brand">{plan.homeType}</p>
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

      {/* Stats + CTA */}
      <div className="mt-10 grid gap-10 md:grid-cols-3">

        {/* Stats */}
        <Reveal>
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-brand">Plan Details</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {stats.map(({ label, value }) => (
                <div key={label} className="card-soft rounded-xl p-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-brand/70">{label}</dt>
                  <dd className="mt-1 text-lg font-semibold text-foreground">{value}</dd>
                </div>
              ))}
            </dl>

            {/* Floor plan PDF / link placeholder */}
            {plan.planUrl ? (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-brand">Floor Plan</h2>
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
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-brand">Floor Plan</h2>
                <div className="mt-4 flex items-center justify-center rounded-2xl border-2 border-dashed border-brand/20 bg-surface py-16 text-center">
                  <div>
                    <p className="text-sm font-medium text-foreground/60">Floor plan coming soon</p>
                    <p className="mt-1 text-xs text-foreground/40">Contact us to request a copy</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Reveal>

        {/* CTA card */}
        <Reveal>
          <div className="card-soft rounded-2xl p-6 flex flex-col gap-4 h-fit">
            <h3 className="text-lg font-semibold text-brand">Interested in this plan?</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Every home we build is customized to fit your lifestyle. Start with this plan and we&apos;ll tailor
              it to your needs, lot, and style.
            </p>
            <Link href="/contact" className="btn-brand text-center">
              Let&apos;s talk
            </Link>
            <Link
              href="/floor-plans"
              className="text-center text-sm font-medium text-brand/70 hover:text-brand transition-colors"
            >
              Browse all plans
            </Link>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
