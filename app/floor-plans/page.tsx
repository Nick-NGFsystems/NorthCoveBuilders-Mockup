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
  const content = await getNgfContent()
  const plansByType = homeTypeOrder.map((homeType) => ({
    homeType,
    plans: floorPlans.filter((plan) => plan.homeType === homeType),
  }));

  const eyebrow = content['floorPlans.eyebrow'] || 'Floor Plans'
  const heading = content['floorPlans.heading'] || 'Start with a plan, then make it yours.'
  const intro = content['floorPlans.intro'] || 'Designing your home should be one of the most exciting parts of the journey and we are here to make sure it is. Start with one of our existing floor plans and tailor it to fit your lifestyle, or collaborate with us to design something entirely your own. However you begin, the process is built around your ideas, your style, and the way you want to live!'
  const multiStoryHeading = content['floorPlans.multiStoryHeading'] || 'Multi-Story Homes'
  const singleStoryHeading = content['floorPlans.singleStoryHeading'] || 'Single-Story Homes'
  const viewDetailsCta = content['floorPlans.viewDetailsCta'] || 'View Plan Details'
  const bottomCta = content['floorPlans.bottomCta'] || "Let's discuss your ideas!"

  const sectionHeadings: Record<string, string> = {
    'Multi-Story': multiStoryHeading,
    'Single-Story': singleStoryHeading,
  }
  const sectionKeys: Record<string, string> = {
    'Multi-Story': 'floorPlans.multiStoryHeading',
    'Single-Story': 'floorPlans.singleStoryHeading',
  }

  return (
    <section className="section-shell !pt-40 md:!pt-[8.5rem]">
      <Reveal>
        <p
          data-ngf-field="floorPlans.eyebrow"
          data-ngf-label="Eyebrow"
          data-ngf-type="text"
          data-ngf-section="Floor Plans"
          className="text-center text-sm font-semibold uppercase tracking-[0.15em] text-brand md:text-left"
        >
          {eyebrow}
        </p>
        <h1
          data-ngf-field="floorPlans.heading"
          data-ngf-label="Heading"
          data-ngf-type="text"
          data-ngf-section="Floor Plans"
          className="mt-3 text-center text-3xl text-brand sm:text-4xl md:text-left md:text-5xl"
        >
          {heading}
        </h1>
        <p
          data-ngf-field="floorPlans.intro"
          data-ngf-label="Intro Paragraph"
          data-ngf-type="textarea"
          data-ngf-section="Floor Plans"
          className="mt-4 text-center text-foreground/80 md:text-left"
        >
          {intro}
        </p>
      </Reveal>

      <div className="mt-10 space-y-12">
        {plansByType.map(({ homeType, plans }) => (
          <div key={homeType}>
            <Reveal>
              <h2
                data-ngf-field={sectionKeys[homeType]}
                data-ngf-label={`${homeType} Section Heading`}
                data-ngf-type="text"
                data-ngf-section="Floor Plans"
                className="text-center text-2xl text-brand sm:text-3xl md:text-left"
              >
                {sectionHeadings[homeType]}
              </h2>
            </Reveal>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan, planIdx) => {
                const planKeyBase = `floorPlans.${homeType === 'Multi-Story' ? 'multiStory' : 'singleStory'}Items.${planIdx}`
                const planName = content[`${planKeyBase}.name`] || plan.name
                return (
                <Reveal key={plan.name}>
                  <Link href={`/floor-plans/${toSlug(plan.name)}`} className="block group">
                    <article className="overflow-hidden rounded-2xl border border-black/5 bg-white transition hover:shadow-md">
                      <div className="relative h-56">
                        <Image
                          src={plan.image}
                          alt={planName}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition group-hover:scale-[1.02]"
                        />
                      </div>
                      <div className="p-5">
                        <h3
                          data-ngf-field={`${planKeyBase}.name`}
                          data-ngf-label="Plan Name"
                          data-ngf-type="text"
                          data-ngf-section="Floor Plans"
                          className="text-xl text-brand"
                        >
                          {planName}
                        </h3>
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
                          data-ngf-field="floorPlans.viewDetailsCta"
                          data-ngf-label="View Plan Details Button"
                          data-ngf-type="text"
                          data-ngf-section="Floor Plans"
                          className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-brand/20 bg-surface px-4 py-2.5 text-sm font-semibold text-brand transition group-hover:bg-brand group-hover:text-white"
                        >
                          {viewDetailsCta}
                        </span>
                      </div>
                    </article>
                  </Link>
                </Reveal>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <Reveal>
        <div className="mt-10 text-center md:text-left">
          <Link href="/contact" className="btn-brand">
            <span
              data-ngf-field="floorPlans.bottomCta"
              data-ngf-label="Bottom CTA Button"
              data-ngf-type="text"
              data-ngf-section="Floor Plans"
            >
              {bottomCta}
            </span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
