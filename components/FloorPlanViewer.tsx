"use client";

import Image from "next/image";
import { useState } from "react";

type PlanImage = { label: string; src: string; sqFt?: number };

export function FloorPlanViewer({
  images,
  planName,
  planPdf,
}: {
  images: PlanImage[];
  planName: string;
  planPdf?: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div>
      {/* Tabs row + download button */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {images.length > 1 &&
          images.map((img, i) => (
            <button
              key={img.label}
              onClick={() => setActive(i)}
              className={`rounded-lg px-4 py-2 text-left text-sm font-semibold transition ${
                active === i
                  ? "bg-brand text-white"
                  : "border border-brand/20 bg-surface text-brand hover:bg-brand/5"
              }`}
            >
              <span className="block">{img.label}</span>
              {img.sqFt && (
                <span className={`block text-xs font-normal ${active === i ? "text-white/80" : "text-brand/60"}`}>
                  {img.sqFt.toLocaleString()} sq ft
                </span>
              )}
            </button>
          ))}

        {planPdf && (
          <a
            href={planPdf}
            download
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-brand/20 bg-surface px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand/5"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M12 3v13m0 0l-4-4m4 4l4-4M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download Floor Plan
          </a>
        )}
      </div>

      {/* Image */}
      <div className="mt-4 relative w-full overflow-hidden rounded-2xl bg-slate-50" style={{ aspectRatio: "4/3" }}>
        <Image
          key={images[active].src}
          src={images[active].src}
          alt={`${planName} — ${images[active].label}`}
          fill
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-contain"
        />
      </div>
    </div>
  );
}
