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

type Props = {
  content?: Record<string, string>
}

export function ReviewsCarousel({ content = {} }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});

  const showMoreLabel = content['reviews.showMore'] || 'Show more'
  const showLessLabel = content['reviews.showLess'] || 'Show less'
  const readMoreLabel = content['reviews.readMore'] || 'Read more reviews'

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
        <div
          data-ngf-group="reviews.items"
          data-ngf-item-label="Review"
          data-ngf-min-items="1"
          data-ngf-max-items="30"
          data-ngf-item-fields='[{"key":"quote","label":"Review Quote","type":"textarea"},{"key":"name","label":"Reviewer Name","type":"text"},{"key":"platform","label":"Platform","type":"text"}]'
          className="contents"
        >
        {reviews.map((review, idx) => {
          const quote = content[`reviews.items.${idx}.quote`] || review.quote
          const name  = content[`reviews.items.${idx}.name`]  || review.name
          const platformName = content[`reviews.items.${idx}.platform`] || review.platform
          const platform = platformStyles[platformName] ?? { initial: "?", color: "#9CA3AF" };
          const isExpanded = expandedReviews[review.name] ?? false;
          const isLongReview = quote.length > REVIEW_PREVIEW_LENGTH;
          const quoteToDisplay = isExpanded || !isLongReview ? quote : `${quote.slice(0, REVIEW_PREVIEW_LENGTH).trim()}...`;

          return (
            <article
              key={review.name}
              data-review-card
              className="card-soft flex-none snap-start rounded-2xl md:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
            >
              <p className="text-brand">★★★★★</p>
              <p
                data-ngf-field={`reviews.items.${idx}.quote`}
                data-ngf-label="Review Quote"
                data-ngf-type="textarea"
                data-ngf-section="Reviews"
                className="mt-3 whitespace-pre-line text-sm leading-7 text-foreground/80"
              >
                {`“${quoteToDisplay}”`}
              </p>
              {isLongReview ? (
                <button
                  type="button"
                  onClick={() => toggleExpanded(review.name)}
                  className="mt-2 text-sm font-semibold text-brand hover:underline"
                >
                  <span
                    data-ngf-field={isExpanded ? 'reviews.showLess' : 'reviews.showMore'}
                    data-ngf-label={isExpanded ? 'Show Less Label' : 'Show More Label'}
                    data-ngf-type="text"
                    data-ngf-section="Reviews"
                  >
                    {isExpanded ? showLessLabel : showMoreLabel}
                  </span>
                </button>
              ) : null}
              <p
                data-ngf-field={`reviews.items.${idx}.name`}
                data-ngf-label="Reviewer Name"
                data-ngf-type="text"
                data-ngf-section="Reviews"
                className="mt-5 text-sm font-semibold text-foreground"
              >
                {name}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-xs font-medium text-foreground/80">
                <span
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: platform.color }}
                >
                  {platform.initial}
                </span>
                <span
                  data-ngf-field={`reviews.items.${idx}.platform`}
                  data-ngf-label="Platform"
                  data-ngf-type="text"
                  data-ngf-section="Reviews"
                >
                  {platformName}
                </span>
              </div>
            </article>
          );
        })}
        </div>

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
            <span
              data-ngf-field="reviews.readMore"
              data-ngf-label="Read More Button"
              data-ngf-type="text"
              data-ngf-section="Reviews"
            >
              {readMoreLabel}
            </span>
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