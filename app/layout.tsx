import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { LocalBusinessSchema } from "@/app/local-business-schema";
import { PageChrome } from "@/components/layout/PageChrome";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://northcovebuilders.com"),
  title: {
    default: "North Cove Builders | Custom Homes in West Michigan",
    template: "%s | North Cove Builders",
  },
  description:
    "North Cove Builders creates personal, boutique custom homes across Hudsonville, Jenison, Zeeland, Byron Center, Grand Rapids, and surrounding West Michigan communities.",
  keywords: [
    "custom home builder",
    "West Michigan home builder",
    "Hudsonville home builder",
    "new home construction Michigan",
    "custom homes Grand Rapids",
    "North Cove Builders",
  ],
  authors: [{ name: "North Cove Builders" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "North Cove Builders",
    title: "North Cove Builders | Custom Homes in West Michigan",
    description:
      "Personal, boutique custom homes across Hudsonville and surrounding West Michigan communities. Transparent pricing. A clear process.",
    images: [
      {
        url: "/projects/001.jpg",
        width: 1200,
        height: 630,
        alt: "North Cove Builders custom home in West Michigan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "North Cove Builders | Custom Homes in West Michigan",
    description:
      "Personal, boutique custom homes across Hudsonville and surrounding West Michigan communities.",
    images: ["/projects/001.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${inter.variable} ${dmSerif.variable} antialiased`}>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <LocalBusinessSchema />
        <PageChrome>{children}</PageChrome>
      </body>
    </html>
  );
}
