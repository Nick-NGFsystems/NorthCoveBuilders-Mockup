import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { getNgfContent } from "@/lib/ngf";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore room-by-room photo inspiration from North Cove Builders custom homes on Houzz, including kitchens, living spaces, exteriors, and more.",
};

export default async function GalleryPage() {
  const content = await getNgfContent()

  const eyebrow = content['gallery.eyebrow'] || 'Gallery'
  const heading = content['gallery.heading'] || 'Explore room-by-room inspiration on Houzz.'
  const body = content['gallery.body'] || 'View North Cove Builders photos by kitchen, living space, exterior, and more directly on our Houzz gallery.'
  const ctaLabel = content['gallery.cta'] || 'View Full Gallery on Houzz'

  return (
    <section className="section-shell !pt-40 md:!pt-[8.5rem]">
      <Reveal>
        <div className="mx-auto max-w-3xl rounded-2xl bg-surface p-6 text-center md:p-12">
          <p
            data-ngf-field="gallery.eyebrow"
            data-ngf-label="Eyebrow"
            data-ngf-type="text"
            data-ngf-section="Gallery"
            className="text-sm font-semibold uppercase tracking-[0.15em] text-brand"
          >
            {eyebrow}
          </p>
          <h1
            data-ngf-field="gallery.heading"
            data-ngf-label="Heading"
            data-ngf-type="text"
            data-ngf-section="Gallery"
            className="mt-3 text-3xl text-brand sm:text-4xl md:text-5xl"
          >
            {heading}
          </h1>
          <p
            data-ngf-field="gallery.body"
            data-ngf-label="Body"
            data-ngf-type="textarea"
            data-ngf-section="Gallery"
            className="mt-4 text-foreground/80"
          >
            {body}
          </p>
          <Link
            href="https://www.houzz.com/professionals/home-builders"
            className="btn-brand mt-8"
            target="_blank"
            rel="noreferrer"
          >
            <span
              data-ngf-field="gallery.cta"
              data-ngf-label="CTA Button"
              data-ngf-type="text"
              data-ngf-section="Gallery"
            >
              {ctaLabel}
            </span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
