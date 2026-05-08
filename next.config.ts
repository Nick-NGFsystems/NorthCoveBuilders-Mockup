import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
            value: "frame-ancestors 'self' https://app.ngfsystems.com https://*.vercel.app",
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
