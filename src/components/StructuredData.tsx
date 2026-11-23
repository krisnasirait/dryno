import React from "react";
import contentData from "../../content.json";

export default function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dryno.co.id";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${baseUrl}/#organization`,
    name: "DRYNO — Engineering Water Solution",
    alternateName: ["DRYNO", "DRYNO Bali", "Jasa Sumur Bor DRYNO Bali"],
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    image: `${baseUrl}/images/bg-hero-1.jpeg`,
    description:
      "Integrated ground water solution provider specializing in ground water investigation (geolistrik), deep well drilling (sumur bor dalam), well installation, and SIPA ground water permits in Bali, Nusa Penida, Nusa Lembongan, and NTB.",
    telephone: "+6285792096854",
    email: "info@drynotech.com",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressRegion: "Bali",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "-8.409518",
      longitude: "115.188919",
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Bali" },
      { "@type": "AdministrativeArea", name: "Badung" },
      { "@type": "AdministrativeArea", name: "Pecatu" },
      { "@type": "AdministrativeArea", name: "Uluwatu" },
      { "@type": "AdministrativeArea", name: "Canggu" },
      { "@type": "AdministrativeArea", name: "Nusa Penida" },
      { "@type": "AdministrativeArea", name: "Nusa Lembongan" },
      { "@type": "AdministrativeArea", name: "Lombok" },
      { "@type": "AdministrativeArea", name: "Nusa Tenggara Barat" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Ground Water Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Ground Water Investigation / Geolistrik",
            description:
              "Subsurface investigation to detect potential water-bearing aquifers and minimize dry-hole risk.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Deep Well Drilling (Sumur Bor)",
            description:
              "Professional deep well drilling and casing construction for villas, hotels, and commercial facilities.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "SIPA & Ground Water Permitting Assistance",
            description:
              "Comprehensive regulatory support for legal ground water extraction license (SIPA) and NPWPD ABT compliance.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Commercial Water Tanker Cost Simulation Calculator",
            description:
              "Interactive calculator comparing tanker water deliveries versus independent deep well infrastructure.",
          },
        },
      ],
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Tanker-Water Cost Calculator", item: `${baseUrl}/calculator` },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: "DRYNO",
    description: "Engineering Water Solution — Bali & Surrounding Regions",
    publisher: {
      "@id": `${baseUrl}/#organization`,
    },
    inLanguage: ["en-US", "id-ID"],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: contentData.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question.ID || item.question.EN,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer.ID || item.answer.EN,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
    </>
  );
}

