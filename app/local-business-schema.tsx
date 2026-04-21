export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: "North Cove Builders",
    description:
      "Personal, boutique custom home builder serving Greater Grand Rapids, the Lakeshore, and surrounding West Michigan communities including Hudsonville, Byron Center, Caledonia, Grand Rapids, Fennville, Saugatuck, Holland, and Grand Haven.",
    url: "https://northcovebuilders.com",
    telephone: "+16166827422",
    email: "northcovebuilders@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "6147 N. Cove Court",
      addressLocality: "Hudsonville",
      addressRegion: "MI",
      postalCode: "49426",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 42.8706,
      longitude: -85.8647,
    },
    areaServed: [
      "Hudsonville, MI",
      "Byron Center, MI",
      "Caledonia, MI",
      "Grand Rapids, MI",
      "Fennville, MI",
      "Saugatuck, MI",
      "Holland, MI",
      "Grand Haven, MI",
      "Lakeshore, MI",
    ],
    sameAs: [
      "https://www.houzz.com/pro/neal39/north-cove-builders",
      "https://www.facebook.com/NorthCovehomesllc",
    ],
    priceRange: "$$$",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
