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
            value: [
              "default-src 'self'",
              // 'unsafe-inline'/'unsafe-eval' are required by Next.js runtime chunks.
              // googletagmanager = GA4; clarity.ms = Microsoft Clarity. Both are loaded
              // for every visitor by components/Analytics.tsx.
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.clarity.ms https://*.clarity.ms",
              "style-src 'self' 'unsafe-inline'",
              // Unsplash + Vercel Blob (see images.remotePatterns) and GA/Clarity beacons.
              "img-src 'self' data: blob: https:",
              // next/font/google self-hosts at build time, so no external font origin.
              "font-src 'self' data:",
              // app.ngfsystems.com is required for BROWSER-side calls to the NGF public
              // API. getNgfContent() is a server-side fetch and is NOT governed by CSP.
              "connect-src 'self' https://app.ngfsystems.com https://www.google-analytics.com https://*.google-analytics.com https://*.googletagmanager.com https://*.analytics.google.com https://www.clarity.ms https://*.clarity.ms",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              // Lets the NGF portal editor embed this site for live preview.
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
