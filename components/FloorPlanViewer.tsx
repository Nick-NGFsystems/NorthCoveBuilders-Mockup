"use client";

import Image from "next/image";
import { useState } from "react";

type PlanImage = { label: string; src: string };

export function FloorPlanViewer({ images, planName }: { images: PlanImage[]; planName: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      {/* Tab buttons */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-2 flex-wrap">
          {images.map((img, i) => (
            <button
              key={img.label}
              onClick={() => setActive(i)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                active === i
                  ? "bg-brand text-white"
                  : "border border-brand/20 bg-surface text-brand hover:bg-brand/5"
              }`}
            >
              {img.label}
            </button>
          ))}
        </div>
      )}

      {/* Image */}
      <div className="mt-4 relative w-full overflow-hidden rounded-2xl bg-slate-50" style={{ aspectRatio: "4/3" }}>
        <Image
          key={images[active].src}
          src={images[active].src}
          alt={`${planName} — ${images[active].label}`}
          fill
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
