"use client";

import { useState } from "react";

type VideoSource =
  | { kind: "file"; src: string }
  | { kind: "iframe"; src: string };

// Turns whatever link the client pastes into something we can play.
export function resolveVideoSource(url: string): VideoSource | null {
  const value = url.trim();
  if (!value) return null;

  // Google Drive: https://drive.google.com/file/d/<id>/view?...
  const drive = value.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (drive) {
    return { kind: "iframe", src: `https://drive.google.com/file/d/${drive[1]}/preview` };
  }

  // YouTube: watch?v=<id>, youtu.be/<id>, /embed/<id>, /shorts/<id>
  const youtube = value.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (youtube) {
    return {
      kind: "iframe",
      src: `https://www.youtube-nocookie.com/embed/${youtube[1]}?autoplay=1&rel=0`,
    };
  }

  // Direct video file (local /public path or a hosted URL such as Vercel Blob)
  if (/\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(value)) {
    return { kind: "file", src: value };
  }

  return null;
}

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
          preload="metadata"
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
            data-ngf-field="video.posterImage"
            data-ngf-label="Video Cover Photo"
            data-ngf-type="image"
            data-ngf-section="Video"
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
          <span className="pointer-events-none absolute inset-0 bg-black/20 transition group-hover:bg-black/30" />
          {source && (
            <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-brand shadow-lg transition duration-300 group-hover:scale-105 sm:h-20 sm:w-20">
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
