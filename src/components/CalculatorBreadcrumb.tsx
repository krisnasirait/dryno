"use client";

import React from "react";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi2";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/context/translations";

export default function CalculatorBreadcrumb() {
  const { language } = useLanguage();
  const t = translations[language].calculator;
  const homeHref = language === "ID" ? "/?lang=id" : "/?lang=en";

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
        <li>
          <Link
            href={homeHref}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-deep-navy transition-colors group"
          >
            <HiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" aria-hidden />
            <span>{language === "EN" ? "Home" : "Beranda"}</span>
          </Link>
        </li>
        <li aria-hidden className="text-gray-300">/</li>
        <li aria-current="page" className="text-deep-navy">
          {t.backLink}
        </li>
      </ol>
    </nav>
  );
}
