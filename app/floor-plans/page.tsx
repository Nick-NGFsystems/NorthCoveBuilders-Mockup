import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { floorPlans } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Floor Plans",
  description:
    "Explore North Cove Builders floor plans — ranch and multi-story homes ranging from 2,000 to 3,400 sq ft. Start with a plan and make it yours.",
};

const homeTypeOrder = ["Multi-Story", "Single-Story"] as const;

export default function FloorPlansPage() {
  const plansByType = homeTypeOrder.map((homeType) => ({
    homeType,
    plans: floorPlans.filter((plan) => plan.homeType === homeType),
  }));

  return (
    <section className="section-shell !pt-40 md:!pt-[8.5rem]">
      <Reveal>
        <p className="text-center text-sm font-semibold uppercase tracking-[0.15em] text-brand md:text-left">Floor Plans</p>
        <h1 className="mt-3 text-center text-3xl text-brand sm:text-4xl md:text-left md:text-5xl">Start with a plan, then make it yours.</h1>
        <p className="mt-4 text-center text-foreground/80 md:text-left">
          Designing your home should be one of the most exciting parts of the journey and we are here to make sure it is. Start
          with one of our existing floor plans and tailor it to fit your lifestyle, or collaborate with us to design something
          entirely your own. However you begin, the process is built around your ideas, your style, and the way you want to live!
        </p>
      </Reveal>

      <div className="mt-10 space-y-12">
        {plansByType.map(({ homeType, plans }) => (
          <div key={homeType}>
            <Reveal>
              <h2 className="text-center text-2xl text-brand sm:text-3xl md:text-left">{homeType} Homes</h2>
            </Reveal>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <Reveal key={plan.name}>
                  <article className="overflow-hidden rounded-2xl border border-black/5 bg-white">
                    <div className="relative h-56">
                      <Image
                        src={plan.image}
                        alt={plan.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl text-brand">{plan.name}</h3>
                      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-foreground/80">
                        <p>
                          <span className="block text-xs uppercase tracking-[0.12em] text-brand/70">Sq. Feet</span>
                          {plan.squareFeet}
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
                      {plan.planUrl && (
                        <Link
                          href={plan.planUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-brand/20 bg-surface px-4 py-2.5 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
                        >
                          View Floor Plan
                        </Link>
                      )}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Reveal>
        <div className="mt-10 text-center md:text-left">
          <Link href="/contact" className="btn-brand">
            Let&apos;s discuss your ideas!
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
