"use client";

import { useState } from "react";
import { resolveVideoSource } from "@/lib/video";

type HomeVideoProps = {
  videoUrl: string;
  posterImage: string;
  posterAlt: string;
  title: string;
};

export function HomeVideo({ videoUrl, posterImage, posterAlt, title }: HomeVideoProps) {
  const [playing, setPlaying] = useState(false);
  const source = resolveVideoSource(videoUrl);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-brand shadow-sm">
      {playing && source?.kind === "file" && (
        <video
          src={source.src}
          poster={posterImage}
          title={title}
          controls
          autoPlay
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full bg-black object-contain"
        />
      )}

      {playing && source?.kind === "iframe" && (
        <iframe
          src={source.src}
          title={title}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      )}

      {!playing && (
        <button
          type="button"
          onClick={() => source && setPlaying(true)}
          aria-disabled={!source}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 block h-full w-full cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white/80 aria-disabled:cursor-default"
        >
          {/* Plain <img> (not next/image fill) so the NGF bridge can read/write src */}
          <img
            src={posterImage}
            alt={posterAlt}
            loading="lazy"
            data-ngf-field="video.posterImage"
            data-ngf-label="Video Cover Photo"
            data-ngf-type="image"
            data-ngf-section="Video"
            data-ngf-aspect="16:9"
            className="absolute inset-0 h-full w-full object-cover transition duration-500 motion-safe:group-hover:scale-[1.02]"
          />
          <span className="pointer-events-none absolute inset-0 bg-black/20 transition group-hover:bg-black/30" />
          {source && (
            <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-brand shadow-lg transition duration-300 motion-safe:group-hover:scale-105 sm:h-20 sm:w-20">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8">
                <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l10.6-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z" />
              </svg>
            </span>
          )}
        </button>
      )}
    </div>
  );
}
