"use client";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";
import { useLanguage } from "@/context/LanguageContext";

export default function TopBar() {
  const { language } = useLanguage();
  return (
    <div id="solenis-top-bar" className="relative bg-[#0a1628] text-white text-[11px] sm:text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-2 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-emerald-400 font-bold whitespace-nowrap hidden sm:inline">
            DRYNO • Engineering Water Solution
          </span>
          <span className="sm:hidden text-emerald-400 font-bold whitespace-nowrap">DRYNO</span>
          <span className="truncate text-gray-200">
            {language === "EN"
              ? "Integrated Ground Water Investigation & Deep Well Drilling — Bali • Penida • Lombok"
              : "Investigasi Air Tanah & Pengeboran Sumur Dalam Terpadu — Bali • Penida • Lombok"}
          </span>
        </div>
        <Link href="/#about" className="flex items-center gap-1.5 underline underline-offset-2 hover:text-sky-300 shrink-0 font-semibold">
          <span>{language === "EN" ? "More information" : "Info lebih lanjut"}</span>
          <HiArrowRight className="w-3 h-3 text-emerald-400" />
        </Link>
      </div>
    </div>
  );
}
