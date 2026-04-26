import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { availableHomes, availableSites } from "@/lib/site-data";
import { getNgfContent } from "@/lib/ngf";

export default async function AvailablePage() {
  const content = await getNgfContent()

  const eyebrow = content['available.eyebrow'] || 'Available Homes & Home Sites'
  const heading = content['available.heading'] || 'Find your next home opportunity in West Michigan.'
  const homesHeading = content['available.homesHeading'] || 'Available Homes'
  const sitesHeading = content['available.sitesHeading'] || 'Available Home Sites'

  return (
    <section className="section-shell !pt-40 md:!pt-[8.5rem]">
      <Reveal>
        <p
          data-ngf-field="available.eyebrow"
          data-ngf-label="Eyebrow"
          data-ngf-type="text"
          data-ngf-section="Available"
          className="text-center text-sm font-semibold uppercase tracking-[0.15em] text-brand md:text-left"
        >
          {eyebrow}
        </p>
        <h1
          data-ngf-field="available.heading"
          data-ngf-label="Heading"
          data-ngf-type="text"
          data-ngf-section="Available"
          className="mt-3 text-center text-3xl text-brand sm:text-4xl md:text-left md:text-5xl"
        >
          {heading}
        </h1>
      </Reveal>

      <section className="mt-12">
        <Reveal>
          <h2
            data-ngf-field="available.homesHeading"
            data-ngf-label="Homes Section Heading"
            data-ngf-type="text"
            data-ngf-section="Available"
            className="text-center text-2xl text-brand sm:text-3xl md:text-left"
          >
            {homesHeading}
          </h2>
        </Reveal>
        <div
          className="mt-6 grid gap-6 md:grid-cols-2"
          data-ngf-group="available.homes"
          data-ngf-item-label="Home"
          data-ngf-min-items="0"
          data-ngf-max-items="12"
          data-ngf-item-fields='[{"key":"name","label":"Home Name","type":"text"}]'
        >
          {availableHomes.map((home, idx) => {
            const name = content[`available.homes.${idx}.name`] || home.name
            return (
            <Reveal key={home.name}>
              <article className="overflow-hidden rounded-2xl border border-black/5 bg-white">
                <div className="relative h-64">
                  <Image src={home.image} alt={name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
                <div className="p-4 text-center md:text-left">
                  <h3
                    data-ngf-field={`available.homes.${idx}.name`}
                    data-ngf-label="Home Name"
                    data-ngf-type="text"
                    data-ngf-section="Available"
                    className="text-lg text-brand"
                  >
                    {name}
                  </h3>
                </div>
              </article>
            </Reveal>
            )
          })}
        </div>
      </section>

      <section className="mt-16">
        <Reveal>
          <h2
            data-ngf-field="available.sitesHeading"
            data-ngf-label="Sites Section Heading"
            data-ngf-type="text"
            data-ngf-section="Available"
            className="text-center text-2xl text-brand sm:text-3xl md:text-left"
          >
            {sitesHeading}
          </h2>
        </Reveal>
        <div
          className="mt-6 grid gap-6 md:grid-cols-2"
          data-ngf-group="available.sites"
          data-ngf-item-label="Home Site"
          data-ngf-min-items="0"
          data-ngf-max-items="12"
          data-ngf-item-fields='[{"key":"name","label":"Site Name","type":"text"}]'
        >
          {availableSites.map((site, idx) => {
            const name = content[`available.sites.${idx}.name`] || site.name
            return (
            <Reveal key={site.name}>
              <article className="overflow-hidden rounded-2xl border border-black/5 bg-white">
                <div className="relative h-64">
                  <Image src={site.image} alt={name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
                <div className="p-4 text-center md:text-left">
                  <h3
                    data-ngf-field={`available.sites.${idx}.name`}
                    data-ngf-label="Site Name"
                    data-ngf-type="text"
                    data-ngf-section="Available"
                    className="text-lg text-brand"
                  >
                    {name}
                  </h3>
                </div>
              </article>
            </Reveal>
            )
          })}
        </div>
      </section>
    </section>
  );
}
