import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import StructuredData from "@/components/StructuredData";
import LangSync from "@/components/LangSync";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dryno.co.id";

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DRYNO — Engineering Water Solution Bali | Deep Well & Geolistrik",
    template: "%s | DRYNO — Engineering Water Solution",
  },
  description:
    "Integrated ground water solution in Bali. Professional deep well drilling (sumur bor dalam), geoelectric investigation (geolistrik), well construction, and SIPA ground water permitting support across Bali, Nusa Penida, Nusa Lembongan, and NTB.",
  keywords: [
    "DRYNO",
    "DRYNO Bali",
    "Jasa Sumur Bor Bali",
    "Deep Well Drilling Bali",
    "Pengeboran Sumur Dalam Bali",
    "Geolistrik Bali",
    "Ground Water Investigation Bali",
    "Jasa Geolistrik Air Tanah",
    "Izin SIPA Bali",
    "Pengurusan SIPA Air Tanah",
    "Water Solution Bali",
    "Sumur Bor Pecatu",
    "Sumur Bor Uluwatu",
    "Sumur Bor Canggu",
    "Kalkulator Air Tangki",
    "Water Tanker Cost Calculator Bali",
    "Nusa Penida Well Drilling",
    "Nusa Lembongan",
    "Lombok NTB",
  ],
  authors: [{ name: "DRYNO Engineering Water Solution", url: siteUrl }],
  creator: "DRYNO",
  publisher: "DRYNO",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "en": "/?lang=en",
      "id": "/?lang=id",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: ["en_US"],
    url: siteUrl,
    siteName: "DRYNO — Engineering Water Solution",
    title: "DRYNO — Engineering Water Solution Bali | Deep Well & Geolistrik",
    description:
      "Integrated ground water solutions: geoelectric investigation, deep well drilling, and SIPA legal compliance support for villas, resorts, and commercial developments across Bali & NTB.",
    images: [
      {
        url: "/images/bg-hero-1.jpeg",
        width: 1200,
        height: 630,
        alt: "DRYNO Engineering Water Solution Bali",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DRYNO — Engineering Water Solution Bali",
    description:
      "Ground water investigation, professional deep well drilling, and SIPA licensing in Bali and surrounding islands.",
    images: ["/images/bg-hero-1.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Engineering & Construction",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} font-sans antialiased scroll-smooth`}
    >
      <head>
        <StructuredData />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-warm-white text-charcoal flex flex-col"
      >
        <LanguageProvider>
          <LangSync />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
