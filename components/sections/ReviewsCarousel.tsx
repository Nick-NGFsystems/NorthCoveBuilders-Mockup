"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { reviews } from "@/lib/site-data";

const platformStyles: Record<string, { initial: string; color: string }> = {
  Google: { initial: "G", color: "#4285F4" },
  Facebook: { initial: "f", color: "#1877F2" },
  Houzz: { initial: "H", color: "#73BA37" },
};

const REVIEW_PREVIEW_LENGTH = 420;

export function ReviewsCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});

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

  const toggleExpanded = (reviewName: string) => {
    setExpandedReviews((previous) => ({
      ...previous,
      [reviewName]: !previous[reviewName],
    }));
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
          const isExpanded = expandedReviews[review.name] ?? false;
          const isLongReview = review.quote.length > REVIEW_PREVIEW_LENGTH;
          const quoteToDisplay = isExpanded || !isLongReview ? review.quote : `${review.quote.slice(0, REVIEW_PREVIEW_LENGTH).trim()}...`;

          return (
            <article
              key={review.name}
              data-review-card
              className="card-soft flex-none snap-start rounded-2xl md:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
            >
              <p className="text-brand">★★★★★</p>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-foreground/80">“{quoteToDisplay}”</p>
              {isLongReview ? (
                <button
                  type="button"
                  onClick={() => toggleExpanded(review.name)}
                  className="mt-2 text-sm font-semibold text-brand hover:underline"
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              ) : null}
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

        <article
          data-review-card
          className="card-soft flex min-h-full flex-none snap-start items-center justify-center rounded-2xl text-center md:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
        >
          <Link
            href="https://www.google.com/maps?output=search&q=north+cove+builders+google+reviews&source=lnms&entry=mc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-brand/20 bg-white px-5 py-2.5 text-sm font-semibold text-brand shadow-sm transition hover:-translate-y-0.5 hover:bg-brand hover:text-white"
          >
            Read more reviews
          </Link>
        </article>
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
    </div>
  );
}