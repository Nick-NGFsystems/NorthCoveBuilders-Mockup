import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack doesn't walk up to C:\Users\nicho\GitHub
  // (a parent lockfile there was being inferred as the root, breaking module resolution).
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        // Vercel Blob — uploaded images from the NGF portal editor
        protocol: "https",
        hostname: "public.blob.vercel-storage.com",
      },
    ],
  },
  async redirects() {
    return [
      // Old WordPress site pages → nearest equivalent on new site
      { source: "/parade-of-homes", destination: "/our-work", permanent: true },
      { source: "/parade-of-homes/", destination: "/our-work", permanent: true },
      { source: "/property/:path*", destination: "/available", permanent: true },
      { source: "/author/:path*", destination: "/about", permanent: true },
      { source: "/home-sites", destination: "/available", permanent: true },
      { source: "/home-sites/", destination: "/available", permanent: true },
      { source: "/our-home-plans", destination: "/floor-plans", permanent: true },
      { source: "/our-home-plans/", destination: "/floor-plans", permanent: true },
      { source: "/homes-for-sale", destination: "/available", permanent: true },
      { source: "/homes-for-sale/", destination: "/available", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            // One policy only: Next.js keeps the last header of a given name,
            // so frame-ancestors lives inside this list, never in a second entry.
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.clarity.ms",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "media-src 'self' blob: https://*.public.blob.vercel-storage.com",
              "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.clarity.ms https://app.ngfsystems.com https://*.vercel-storage.com https://*.public.blob.vercel-storage.com",
              "frame-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self' https://app.ngfsystems.com https://*.vercel.app",
            ].join("; "),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
