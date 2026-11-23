import React from "react";
import type { Metadata } from "next";
import TopBar from "@/components/chema/TopBar";
import ChemHeader from "@/components/chema/ChemHeader";
import ChemEffects from "@/components/chema/ChemEffects";
import FooterChem from "@/components/chema/FooterChem";
import StickyRail from "@/components/chema/StickyRail";
import WhatsAppButton from "@/components/WhatsAppButton";
import WaterTankerCalculator from "@/components/WaterTankerCalculator";
import CalculatorBreadcrumb from "@/components/CalculatorBreadcrumb";

export const metadata: Metadata = {
  title: "Kalkulator Biaya Air Tangki vs Sumur Bor Bali | DRYNO",
  description:
    "Simulasikan dan hitung pengeluaran air truk tangki komersial 5, 10, hingga 25 tahun untuk villa, hotel, dan bisnis di Bali dibandingkan investasi sumur bor mandiri.",
  alternates: {
    canonical: "/calculator",
  },
  openGraph: {
    title: "Kalkulator Pengeluaran Air Tangki vs Sumur Bor | DRYNO Bali",
    description:
      "Hitung estimasi pengeluaran air truk tangki komersial untuk properti villa dan bisnis Anda di Bali dalam proyeksi 5, 10, hingga 25 tahun.",
    url: "https://dryno.co.id/calculator",
    type: "website",
  },
};

export default function CalculatorPage() {
  return (
    <main id="main-content" className="min-h-screen bg-warm-white flex flex-col font-sans">
      <ChemEffects />
      <TopBar />
      <ChemHeader />

      <div className="pt-6 sm:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-1 sm:pb-2">
          <CalculatorBreadcrumb />
        </div>

        <WaterTankerCalculator />
      </div>

      <FooterChem />
      <StickyRail />
      <WhatsAppButton />
    </main>
  );
}
