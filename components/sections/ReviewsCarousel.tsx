"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { reviews } from "@/lib/site-data";

const platformStyles: Record<string, { initial: string; color: string }> = {
  Google: { initial: "G", color: "#4285F4" },
  Facebook: { initial: "f", color: "#1877F2" },
  Houzz: { initial: "H", color: "#73BA37" },
};

export function ReviewsCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const container = containerRef.current;
    if (!container) return;

    const atStart = container.scrollLeft <= 0;
    const atEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;

    setCanScrollLeft(!atStart);
    setCanScrollRight(!atEnd);
  };

  useEffect(() => {
    updateScrollState();
  }, []);

  const scrollByCard = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;

    const firstCard = container.querySelector<HTMLElement>("[data-review-card]");
    const cardWidth = firstCard?.offsetWidth ?? container.clientWidth;

    container.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scrollByCard("left")}
        disabled={!canScrollLeft}
        className="absolute left-0 top-1/2 z-10 -translate-x-4 -translate-y-1/2 rounded-full bg-white p-2 text-brand shadow-sm disabled:opacity-30"
        aria-label="Scroll reviews left"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        ref={containerRef}
        onScroll={updateScrollState}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth"
      >
        {reviews.map((review) => {
          const platform = platformStyles[review.platform] ?? { initial: "?", color: "#9CA3AF" };

          return (
            <article
              key={review.name}
              data-review-card
              className="card-soft flex-none snap-start rounded-2xl md:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
            >
              <p className="text-brand">★★★★★</p>
              <p className="mt-3 text-sm leading-7 text-foreground/80">“{review.quote}”</p>
              <p className="mt-5 text-sm font-semibold text-foreground">{review.name}</p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-xs font-medium text-foreground/80">
                <span
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: platform.color }}
                >
                  {platform.initial}
                </span>
                <span>{review.platform}</span>
              </div>
            </article>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => scrollByCard("right")}
        disabled={!canScrollRight}
        className="absolute right-0 top-1/2 z-10 translate-x-4 -translate-y-1/2 rounded-full bg-white p-2 text-brand shadow-sm disabled:opacity-30"
        aria-label="Scroll reviews right"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="mt-8 text-center">
        <Link
          href="https://www.google.com/maps/place/North+Cove+Builders/@42.8807944,-85.8270019,17z/data=!3m1!4b1!4m6!3m5!1s0x8819bb3629b90ae9:0xaf214a670658882a"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-full border border-brand/20 bg-white px-5 py-2.5 text-sm font-semibold text-brand shadow-sm transition hover:-translate-y-0.5 hover:bg-brand hover:text-white"
        >
          Read more reviews
        </Link>
      </div>
    </div>
  );
}
