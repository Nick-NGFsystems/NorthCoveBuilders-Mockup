export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: "North Cove Builders",
    description:
      "Personal, boutique custom home builder serving Hudsonville, Jenison, Zeeland, Byron Center, Grand Rapids, and surrounding West Michigan communities.",
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
      "Jenison, MI",
      "Zeeland, MI",
      "Byron Center, MI",
      "Grand Rapids, MI",
    ],
    sameAs: [
      "https://www.houzz.com/pro/neal39/north-cove-builders",
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
