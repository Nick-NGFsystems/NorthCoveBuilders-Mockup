import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { availableProperties } from "@/lib/site-data";
import { PropertyCard } from "@/components/sections/PropertyCard";
import { getNgfContent } from "@/lib/ngf";

export const metadata: Metadata = {
  title: "Available Properties",
  description:
    "Browse available homes and home sites from North Cove Builders in West Michigan — vacant lots and homes currently under construction.",
};

export default async function AvailablePage() {
  const content = await getNgfContent();

  const eyebrow = content["available.eyebrow"] || "Available Properties";
  const heading =
    content["available.heading"] ||
    "Find your next home opportunity in West Michigan.";
  const propertiesHeading =
    content["available.propertiesHeading"] || "Available Now";

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
            data-ngf-field="available.propertiesHeading"
            data-ngf-label="Properties Section Heading"
            data-ngf-type="text"
            data-ngf-section="Available"
            className="text-center text-2xl text-brand sm:text-3xl md:text-left"
          >
            {propertiesHeading}
          </h2>
        </Reveal>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {availableProperties.map((property, idx) => (
            <Reveal key={property.name}>
              <PropertyCard
                property={property}
                contentName={content[`available.properties.${idx}.name`] || property.name}
                contentAddress={content[`available.properties.${idx}.address`] || property.address}
                contentPrice={content[`available.properties.${idx}.price`] || property.price}
                idx={idx}
              />
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <Reveal>
        <div className="mt-16 text-center md:text-left">
          <p className="text-foreground/70">
            Don&apos;t see what you&apos;re looking for?{" "}
            <Link href="/contact" className="font-semibold text-brand hover:underline">
              Let&apos;s talk about building your custom home.
            </Link>
          </p>
        </div>
      </Reveal>
    </section>
  );
}
