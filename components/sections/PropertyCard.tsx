"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";

type Property = {
  name: string;
  address: string;
  status: "Under Construction" | "Vacant Lot";
  price: string;
  image: string;
  images: string[];
  flierPdf: string;
  listingUrl: string;
};

const statusStyles: Record<string, string> = {
  "Under Construction": "bg-amber-100 text-amber-800",
  "Vacant Lot": "bg-emerald-100 text-emerald-700",
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const ZOOM_IN_LEVEL = 2.5;
const DRAG_THRESHOLD = 6; // px before a tap becomes a drag

function getDist(t: TouchList) {
  const dx = t[0].clientX - t[1].clientX;
  const dy = t[0].clientY - t[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

export function PropertyCard({
  property,
  contentName,
  contentAddress,
  contentPrice,
  idx,
}: {
  property: Property;
  contentName: string;
  contentAddress: string;
  contentPrice: string;
  idx: number;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  // Refs so event-listener closures always see fresh values
  const zoomRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });
  const imgContainerRef = useRef<HTMLDivElement>(null);

  // Drag tracking (mouse)
  const mouseDragOrigin = useRef({ x: 0, y: 0 });
  const mouseOffsetOrigin = useRef({ x: 0, y: 0 });
  const mouseMoved = useRef(false);

  const images = property.images;
  const hasMultiple = images.length > 1;

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const applyZoom = useCallback((z: number) => {
    const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));
    zoomRef.current = clamped;
    setZoom(clamped);
    if (clamped <= 1) {
      offsetRef.current = { x: 0, y: 0 };
      setOffset({ x: 0, y: 0 });
    }
  }, []);

  const applyOffset = useCallback((o: { x: number; y: number }) => {
    offsetRef.current = o;
    setOffset(o);
  }, []);

  const resetZoom = useCallback(() => {
    applyZoom(MIN_ZOOM);
    applyOffset({ x: 0, y: 0 });
    setDragging(false);
  }, [applyZoom, applyOffset]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    resetZoom();
  }, [resetZoom]);

  const prev = useCallback(() => {
    setActiveImg((i) => (i - 1 + images.length) % images.length);
    resetZoom();
  }, [images.length, resetZoom]);

  const next = useCallback(() => {
    setActiveImg((i) => (i + 1) % images.length);
    resetZoom();
  }, [images.length, resetZoom]);

  const jumpTo = useCallback((i: number) => {
    setActiveImg(i);
    resetZoom();
  }, [resetZoom]);

  // ── Keyboard ────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft" && zoomRef.current <= 1) prev();
      if (e.key === "ArrowRight" && zoomRef.current <= 1) next();
      if (e.key === "+" || e.key === "=") applyZoom(zoomRef.current + 0.75);
      if (e.key === "-") applyZoom(zoomRef.current - 0.75);
      if (e.key === "0") resetZoom();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, prev, next, closeLightbox, applyZoom, resetZoom]);

  // ── Body scroll lock ─────────────────────────────────────────────────────────

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  // ── Mouse events (desktop) ───────────────────────────────────────────────────

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    mouseDragOrigin.current = { x: e.clientX, y: e.clientY };
    mouseOffsetOrigin.current = { ...offsetRef.current };
    mouseMoved.current = false;
    if (zoomRef.current > 1) setDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!e.buttons) return;
    const dx = e.clientX - mouseDragOrigin.current.x;
    const dy = e.clientY - mouseDragOrigin.current.y;
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      mouseMoved.current = true;
    }
    if (zoomRef.current > 1 && mouseMoved.current) {
      applyOffset({
        x: mouseOffsetOrigin.current.x + dx,
        y: mouseOffsetOrigin.current.y + dy,
      });
    }
  }, [applyOffset]);

  const handleMouseUp = useCallback(() => {
    setDragging(false);
    if (!mouseMoved.current) {
      // Single click — toggle zoom
      if (zoomRef.current > 1) {
        resetZoom();
      } else {
        applyZoom(ZOOM_IN_LEVEL);
      }
    }
    mouseMoved.current = false;
  }, [resetZoom, applyZoom]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    applyZoom(zoomRef.current - e.deltaY * 0.002);
  }, [applyZoom]);

  // ── Touch events (mobile) — registered with passive:false ────────────────────

  useEffect(() => {
    const el = imgContainerRef.current;
    if (!el || !lightboxOpen) return;

    // Touch tracking
    let tapOrigin = { x: 0, y: 0 };
    let touchMoved = false;
    let dragStartOffset = { x: 0, y: 0 };
    let dragStartTouch = { x: 0, y: 0 };
    let pinchInitialDist = 0;
    let pinchInitialZoom = 1;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 1) {
        touchMoved = false;
        tapOrigin = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        dragStartTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        dragStartOffset = { ...offsetRef.current };
      } else if (e.touches.length === 2) {
        pinchInitialDist = getDist(e.touches);
        pinchInitialZoom = zoomRef.current;
        touchMoved = true; // suppress tap on pinch-end
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 2) {
        // Pinch zoom
        const ratio = getDist(e.touches) / pinchInitialDist;
        const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, pinchInitialZoom * ratio));
        zoomRef.current = newZoom;
        setZoom(newZoom);
        if (newZoom <= 1) {
          offsetRef.current = { x: 0, y: 0 };
          setOffset({ x: 0, y: 0 });
        }
      } else if (e.touches.length === 1) {
        const dx = e.touches[0].clientX - dragStartTouch.x;
        const dy = e.touches[0].clientY - dragStartTouch.y;
        if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
          touchMoved = true;
        }
        if (zoomRef.current > 1 && touchMoved) {
          const next = {
            x: dragStartOffset.x + dx,
            y: dragStartOffset.y + dy,
          };
          offsetRef.current = next;
          setOffset(next);
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 0 && !touchMoved) {
        // Single tap — toggle zoom
        const dx = Math.abs(e.changedTouches[0].clientX - tapOrigin.x);
        const dy = Math.abs(e.changedTouches[0].clientY - tapOrigin.y);
        if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) {
          if (zoomRef.current > 1) {
            // Reset
            zoomRef.current = 1;
            offsetRef.current = { x: 0, y: 0 };
            setZoom(1);
            setOffset({ x: 0, y: 0 });
          } else {
            zoomRef.current = ZOOM_IN_LEVEL;
            setZoom(ZOOM_IN_LEVEL);
          }
        }
      }
      if (e.touches.length === 0) {
        setDragging(false);
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: false });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [lightboxOpen]);

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      <article className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:shadow-md">
        {/* Thumbnail */}
        <button
          type="button"
          className="relative block h-80 w-full overflow-hidden bg-slate-100 focus:outline-none"
          onClick={() => { setActiveImg(0); setLightboxOpen(true); }}
          aria-label={`View photos of ${contentName}`}
        >
          <Image
            src={property.image}
            alt={contentName}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition duration-300 hover:scale-[1.03]"
          />
          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
              statusStyles[property.status] || "bg-slate-100 text-slate-700"
            }`}
          >
            {property.status}
          </span>
          {hasMultiple && (
            <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {images.length} photos
            </span>
          )}
          <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 hover:opacity-100">
            <span className="rounded-full bg-black/50 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
              {hasMultiple ? "View all photos" : "View full size"}
            </span>
          </span>
        </button>

        {/* Card body */}
        <div className="p-5">
          <h3
            data-ngf-field={`available.properties.${idx}.name`}
            data-ngf-label="Property Name"
            data-ngf-type="text"
            data-ngf-section="Available"
            className="text-xl text-brand"
          >
            {contentName}
          </h3>
          <p
            data-ngf-field={`available.properties.${idx}.address`}
            data-ngf-label="Address"
            data-ngf-type="text"
            data-ngf-section="Available"
            className="mt-1 text-sm text-foreground/60"
          >
            {contentAddress}
          </p>
          {contentPrice && (
            <p
              data-ngf-field={`available.properties.${idx}.price`}
              data-ngf-label="Price"
              data-ngf-type="text"
              data-ngf-section="Available"
              className="mt-3 text-lg font-semibold text-brand"
            >
              {contentPrice}
            </p>
          )}
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
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                  <path d="M12 3v13m0 0l-4-4m4 4l4-4M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative flex max-h-full w-full max-w-5xl flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3">
              <div>
                <p className="font-semibold text-white">{contentName}</p>
                {hasMultiple && (
                  <p className="text-sm text-white/60">{activeImg + 1} / {images.length}</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                {zoom > 1 && (
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80">
                    {Math.round(zoom * 100)}%
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => applyZoom(zoomRef.current + 0.75)}
                  className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                  aria-label="Zoom in"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => applyZoom(zoomRef.current - 0.75)}
                  className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                  aria-label="Zoom out"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M21 21l-4.35-4.35M8 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                {zoom > 1 && (
                  <button
                    type="button"
                    onClick={resetZoom}
                    className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                    aria-label="Reset zoom"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                      <path d="M3.51 9a9 9 0 1 1-.49 4m.49-4H7m-3.5 0V5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeLightbox}
                  className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Image area */}
            <div
              ref={imgContainerRef}
              className="relative w-full select-none overflow-hidden rounded-xl bg-black"
              style={{
                aspectRatio: "4/3",
                cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "zoom-in",
                touchAction: "none",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => { setDragging(false); mouseMoved.current = false; }}
              onWheel={handleWheel}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
                  transformOrigin: "center",
                  transition: dragging ? "none" : "transform 0.15s ease",
                  willChange: "transform",
                }}
              >
                <Image
                  key={images[activeImg]}
                  src={images[activeImg]}
                  alt={`${contentName} — photo ${activeImg + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                  draggable={false}
                />
              </div>

              {/* Prev / Next — hidden when zoomed */}
              {hasMultiple && zoom <= 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); prev(); }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2.5 text-white transition hover:bg-black/75"
                    aria-label="Previous photo"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); next(); }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2.5 text-white transition hover:bg-black/75"
                    aria-label="Next photo"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </>
              )}

              {/* Hint */}
              <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/40 px-3 py-1 text-xs text-white/60 backdrop-blur-sm transition-opacity duration-300"
                style={{ opacity: zoom > 1 ? 0 : 1 }}
              >
                <span className="hidden sm:inline">Click to zoom · Scroll to zoom · Drag to pan</span>
                <span className="sm:hidden">Tap to zoom · Pinch to zoom · Drag to pan</span>
              </p>
            </div>

            {/* Dots */}
            {hasMultiple && (
              <div className="mt-4 flex justify-center gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => jumpTo(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === activeImg ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Photo ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Thumbnails */}
            {hasMultiple && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {images.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => jumpTo(i)}
                    className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg transition ${
                      i === activeImg
                        ? "ring-2 ring-white ring-offset-2 ring-offset-black"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`Thumbnail ${i + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
