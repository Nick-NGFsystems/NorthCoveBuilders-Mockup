"use client";

import Image from "next/image";

const photos = [
  { src: "/interior/conrail-01.jpg",  alt: "Interior living space" },
  { src: "/interior/conrail-02.jpg",  alt: "Interior kitchen" },
  { src: "/interior/conrail-03.jpg",  alt: "Interior dining area" },
  { src: "/interior/interior-04.jpg", alt: "Interior bedroom" },
  { src: "/interior/interior-05.jpg", alt: "Interior bathroom" },
  { src: "/interior/interior-06.jpg", alt: "Interior detail" },
  { src: "/interior/interior-07.jpg", alt: "Interior room" },
  { src: "/interior/interior-08.jpg", alt: "Interior living area" },
  { src: "/interior/interior-09.jpg", alt: "Interior space" },
];

// Duplicate for seamless infinite loop
const reel = [...photos, ...photos];

export function InteriorPhotoReel() {
  return (
    <section className="overflow-hidden bg-brand py-16">
      <div className="section-shell mb-10">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.15em] text-white/70 md:text-left">
          Interior Craftsmanship
        </p>
        <h2 className="mt-2 text-center text-2xl text-white sm:text-3xl md:text-left">
          Every detail, built for how you live.
        </h2>
      </div>

      {/* Scrolling strip */}
      <div className="relative w-full overflow-hidden">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-brand to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-brand to-transparent" />

        <div
          className="flex gap-4 will-change-transform"
          style={{
            animation: "scroll-reel 40s linear infinite",
          }}
        >
          {reel.map((photo, i) => (
            <div
              key={i}
              className="relative h-72 w-80 shrink-0 overflow-hidden rounded-2xl sm:h-80 sm:w-96"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="384px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll-reel {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .flex:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
