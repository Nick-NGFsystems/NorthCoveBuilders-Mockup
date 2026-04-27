import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { availableProperties } from "@/lib/site-data";
import { getNgfContent } from "@/lib/ngf";

export const metadata: Metadata = {
  title: "Available Properties",
  description:
    "Browse available homes and home sites from North Cove Builders in West Michigan — vacant lots and homes currently under construction.",
};

const statusStyles: Record<string, string> = {
  "Under Construction": "bg-amber-100 text-amber-800",
  "Vacant Lot": "bg-emerald-100 text-emerald-700",
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
          {availableProperties.map((property, idx) => {
            const name =
              content[`available.properties.${idx}.name`] || property.name;
            const address =
              content[`available.properties.${idx}.address`] ||
              property.address;
            const price =
              content[`available.properties.${idx}.price`] || property.price;

            return (
              <Reveal key={property.name}>
                <article className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:shadow-md">
                  {/* Image */}
                  <div className="relative h-64 bg-slate-100">
                    <Image
                      src={property.image}
                      alt={name}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                    />
                    {/* Status badge */}
                    <span
                      className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                        statusStyles[property.status] ||
                        "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {property.status}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="p-5">
                    <h3
                      data-ngf-field={`available.properties.${idx}.name`}
                      data-ngf-label="Property Name"
                      data-ngf-type="text"
                      data-ngf-section="Available"
                      className="text-xl text-brand"
                    >
                      {name}
                    </h3>
                    <p
                      data-ngf-field={`available.properties.${idx}.address`}
                      data-ngf-label="Address"
                      data-ngf-type="text"
                      data-ngf-section="Available"
                      className="mt-1 text-sm text-foreground/60"
                    >
                      {address}
                    </p>
                    {price && (
                      <p
                        data-ngf-field={`available.properties.${idx}.price`}
                        data-ngf-label="Price"
                        data-ngf-type="text"
                        data-ngf-section="Available"
                        className="mt-3 text-lg font-semibold text-brand"
                      >
                        {price}
                      </p>
                    )}

                    {/* CTAs */}
                    <div className="mt-4 flex flex-wrap gap-3">
                      {property.listingUrl && (
                        <Link
                          href={property.listingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand/90"
                        >
                          View Listing
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </Link>
                      )}
                      {property.flierPdf && (
                        <a
                          href={property.flierPdf}
                          download
                          className="inline-flex items-center gap-1.5 rounded-lg border border-brand/20 bg-surface px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand/5"
                        >
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                            <path d="M12 3v13m0 0l-4-4m4 4l4-4M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Download Flier
                        </a>
                      )}
                      {!property.listingUrl && !property.flierPdf && (
                        <Link
                          href="/contact"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand/90"
                        >
                          Contact Us
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
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
