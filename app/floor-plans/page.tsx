import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { floorPlans, toSlug } from "@/lib/site-data";
import { getNgfContent } from "@/lib/ngf";

export const metadata: Metadata = {
  title: "Floor Plans",
  description:
    "Explore North Cove Builders floor plans — ranch and multi-story homes ranging from 2,000 to 3,400 sq ft. Start with a plan and make it yours.",
};

const homeTypeOrder = ["Multi-Story", "Single-Story"] as const;

export default async function FloorPlansPage() {
  const content = await getNgfContent();

  const eyebrow         = content['floorPlans.eyebrow']         ?? 'Floor Plans';
  const headline        = content['floorPlans.headline']        ?? 'Start with a plan, then make it yours.';
  const body            = content['floorPlans.body']            ?? 'Designing your home should be one of the most exciting parts of the journey and we are here to make sure it is. Start with one of our existing floor plans and tailor it to fit your lifestyle, or collaborate with us to design something entirely your own. However you begin, the process is built around your ideas, your style, and the way you want to live!';
  const multiStoryLabel = content['floorPlans.multiStoryLabel'] ?? 'Multi-Story Homes';
  const singleStoryLabel = content['floorPlans.singleStoryLabel'] ?? 'Single-Story Homes';
  const cardCta         = content['floorPlans.cardCta']         ?? 'View Plan Details';
  const cta             = content['floorPlans.cta']             ?? "Let's discuss your ideas!";

  const sectionLabels: Record<string, string> = {
    'Multi-Story': multiStoryLabel,
    'Single-Story': singleStoryLabel,
  };

  const plansByType = homeTypeOrder.map((homeType) => ({
    homeType,
    plans: floorPlans.filter((plan) => plan.homeType === homeType),
  }));

  return (
    <section className="section-shell !pt-40 md:!pt-[8.5rem]">
      <Reveal>
        <p
          data-ngf-field="floorPlans.eyebrow"
          data-ngf-label="Eyebrow Text"
          data-ngf-type="text"
          data-ngf-section="Floor Plans Page"
          className="text-center text-sm font-semibold uppercase tracking-[0.15em] text-brand md:text-left"
        >
          {eyebrow}
        </p>
        <h1
          data-ngf-field="floorPlans.headline"
          data-ngf-label="Headline"
          data-ngf-type="text"
          data-ngf-section="Floor Plans Page"
          className="mt-3 text-center text-3xl text-brand sm:text-4xl md:text-left md:text-5xl"
        >
          {headline}
        </h1>
        <p
          data-ngf-field="floorPlans.body"
          data-ngf-label="Body Text"
          data-ngf-type="textarea"
          data-ngf-section="Floor Plans Page"
          className="mt-4 text-center text-foreground/80 md:text-left"
        >
          {body}
        </p>
      </Reveal>

      <div className="mt-10 space-y-12">
        {plansByType.map(({ homeType, plans }) => (
          <div key={homeType}>
            <Reveal>
              <h2
                data-ngf-field={homeType === 'Multi-Story' ? 'floorPlans.multiStoryLabel' : 'floorPlans.singleStoryLabel'}
                data-ngf-label={homeType === 'Multi-Story' ? 'Multi-Story Section Label' : 'Single-Story Section Label'}
                data-ngf-type="text"
                data-ngf-section="Floor Plans Page"
                className="text-center text-2xl text-brand sm:text-3xl md:text-left"
              >
                {sectionLabels[homeType]}
              </h2>
            </Reveal>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan, i) => (
                <Link key={plan.name} href={`/floor-plans/${toSlug(plan.name)}`} className="block group">
                  <article className="overflow-hidden rounded-2xl border border-black/5 bg-white transition hover:shadow-md">
                    <div className="relative h-56 bg-slate-100">
                      <Image
                        src={plan.image}
                        alt={plan.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition group-hover:scale-[1.02]"
                        priority={homeType === "Multi-Story" && i < 3}
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl text-brand">{plan.name}</h3>
                      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-foreground/80">
                        <p>
                          <span className="block text-xs uppercase tracking-[0.12em] text-brand/70">Sq. Feet</span>
                          {plan.squareFeet.toLocaleString()}
                        </p>
                        <p>
                          <span className="block text-xs uppercase tracking-[0.12em] text-brand/70">Bedrooms</span>
                          {plan.bedrooms}
                        </p>
                        <p>
                          <span className="block text-xs uppercase tracking-[0.12em] text-brand/70">Baths</span>
                          {plan.baths}
                        </p>
                        <p>
                          <span className="block text-xs uppercase tracking-[0.12em] text-brand/70">Garage Stalls</span>
                          {plan.garageStalls}
                        </p>
                      </div>
                      <span
                        data-ngf-field="floorPlans.cardCta"
                        data-ngf-label="Card Button Text"
                        data-ngf-type="text"
                        data-ngf-section="Floor Plans Page"
                        className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-brand/20 bg-surface px-4 py-2.5 text-sm font-semibold text-brand transition group-hover:bg-brand group-hover:text-white"
                      >
                        {cardCta}
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Reveal>
        <div className="mt-10 text-center md:text-left">
          <Link
            href="/contact"
            data-ngf-field="floorPlans.cta"
            data-ngf-label="Bottom CTA Button"
            data-ngf-type="text"
            data-ngf-section="Floor Plans Page"
            className="btn-brand"
          >
            {cta}
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
