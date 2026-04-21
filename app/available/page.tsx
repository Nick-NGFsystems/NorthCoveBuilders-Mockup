import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { availableHomes, availableSites } from "@/lib/site-data";

export default function AvailablePage() {
  return (
    <section className="section-shell !pt-40 md:!pt-[8.5rem]">
      <Reveal>
        <p className="text-center text-sm font-semibold uppercase tracking-[0.15em] text-brand md:text-left">Available Homes & Home Sites</p>
        <h1 className="mt-3 text-center text-3xl text-brand sm:text-4xl md:text-left md:text-5xl">Find your next home opportunity in West Michigan.</h1>
      </Reveal>

      <section className="mt-12">
        <Reveal>
          <h2 className="text-center text-2xl text-brand sm:text-3xl md:text-left">Available Homes</h2>
        </Reveal>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {availableHomes.map((home) => (
            <Reveal key={home.name}>
              <article className="overflow-hidden rounded-2xl border border-black/5 bg-white">
                <div className="relative h-64">
                  <Image src={home.image} alt={home.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
                <div className="p-4 text-center md:text-left">
                  <h3 className="text-lg text-brand">{home.name}</h3>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <Reveal>
          <h2 className="text-center text-2xl text-brand sm:text-3xl md:text-left">Available Home Sites</h2>
        </Reveal>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {availableSites.map((site) => (
            <Reveal key={site.name}>
              <article className="overflow-hidden rounded-2xl border border-black/5 bg-white">
                <div className="relative h-64">
                  <Image src={site.image} alt={site.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
                <div className="p-4 text-center md:text-left">
                  <h3 className="text-lg text-brand">{site.name}</h3>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </section>
  );
}
