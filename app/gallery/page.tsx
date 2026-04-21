import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore room-by-room photo inspiration from North Cove Builders custom homes on Houzz, including kitchens, living spaces, exteriors, and more.",
};

export default function GalleryPage() {
  return (
    <section className="section-shell !pt-40 md:!pt-[8.5rem]">
      <Reveal>
        <div className="mx-auto max-w-3xl rounded-2xl bg-surface p-6 text-center md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brand">Gallery</p>
          <h1 className="mt-3 text-3xl text-brand sm:text-4xl md:text-5xl">Explore room-by-room inspiration on Houzz.</h1>
          <p className="mt-4 text-foreground/80">
            View North Cove Builders photos by kitchen, living space, exterior, and more directly on our Houzz gallery.
          </p>
          <Link
            href="https://www.houzz.com/professionals/home-builders"
            className="btn-brand mt-8"
            target="_blank"
            rel="noreferrer"
          >
            View Full Gallery on Houzz
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
