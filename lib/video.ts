// Shared helper for the home page video. Kept out of the client component so
// server code can import it too (NGF standards: no shared exports in a 'use client' module).

export type VideoSource =
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
