import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ReviewsCarousel } from "@/components/sections/ReviewsCarousel";
import { featuredProjects } from "@/lib/site-data";

export default function Home() {
  return (
    <>
      <section className="relative min-h-[78vh] overflow-hidden pt-28 text-white md:pt-24">
        <Image
          src="/projects/001.jpg"
          alt="Featured North Cove Builders custom home"
          fill
          priority
          sizes="100vw"
          className="origin-top object-cover object-[73%_top] md:object-top"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="section-shell relative z-10 flex min-h-[78vh] items-end pb-12 md:items-end">
          <Reveal>
            <div className="mx-auto w-full max-w-2xl space-y-6 text-center md:mx-0 md:text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/85">
                North Cove Builders · Hudsonville, Michigan
              </p>
              <h1 className="text-3xl leading-tight sm:text-4xl md:text-6xl">
                Build the home you&apos;ve always dreamed of.
              </h1>
              <p className="max-w-2xl text-base text-white/90 sm:text-lg">
                Custom Designs. Straightforward Pricing. A Clear &amp; Precise Process.
              </p>
              <Link href="/contact" className="btn-brand">
                Schedule a Free Consultation
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-shell">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl text-brand sm:text-3xl md:text-4xl">You&apos;ll feel at home long before you move in.</h2>
            <p className="mt-4 text-lg text-foreground/80">
              We pride ourselves in our dedication to making your home building experience a great one. Good communication is the foundation of our building process, and your involvement and satisfaction is our #1 concern.
            </p>
            <p className="mt-4 text-lg text-foreground/80">
              Working with a builder you trust is key to limiting the stress of building a new home. Our transparent pricing structure, thorough process, and commitment to service are the key elements of our success.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="bg-surface">
        <div className="section-shell">
          <Reveal>
            <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
              <h2 className="text-2xl text-brand sm:text-3xl">Featured Projects</h2>
              <Link
                href="/our-work"
                className="inline-flex items-center rounded-full border border-brand/20 bg-white px-4 py-2 text-sm font-semibold text-brand shadow-sm transition hover:-translate-y-0.5 hover:bg-brand hover:text-white"
              >
                View All Work
              </Link>
            </div>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredProjects.slice(0, 3).map((project) => (
              <Reveal key={project.name}>
                <article className="overflow-hidden rounded-2xl bg-white">
                  <Link href={project.houzzUrl} target="_blank" rel="noreferrer" className="block">
                    <div className="relative h-60">
                      <Image src={project.image} alt={project.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                    </div>
                    <div className="p-5 text-center">
                      <h3 className="text-xl text-brand">{project.name}</h3>
                    </div>
                  </Link>
                  <div className="px-5 pb-5 text-center">
                    <Link href={project.houzzUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-brand hover:underline">
                      View on Houzz
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <Reveal>
          <h2 className="mb-8 text-center text-2xl text-brand sm:text-3xl">What Homeowners Are Saying</h2>
        </Reveal>
        <Reveal>
          <div className="px-5">
            <ReviewsCarousel />
          </div>
        </Reveal>
      </section>
    </>
  );
}
