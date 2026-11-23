"use client";

import React from "react";
import Image from "next/image";
import {
  HiArrowRight,
  HiExclamationCircle,
  HiArrowTopRightOnSquare,
  HiNewspaper,
  HiAcademicCap,
  HiMegaphone,
} from "react-icons/hi2";
import { useLanguage } from "@/context/LanguageContext";

const articleIcons = [HiNewspaper, HiAcademicCap, HiMegaphone];

export default function WaterChallenges() {
  const { language, content } = useLanguage();
  const wc = content.waterChallenges;

  return (
    <section
      id="water-challenges"
      className="relative py-8 sm:py-16 lg:py-24 bg-gradient-to-b from-white via-warm-white to-warm-white text-deep-navy overflow-hidden"
    >

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Eyebrow, Main Headline, Copy & CTAs */}
        <div className="max-w-4xl mb-5 sm:mb-10 space-y-3 sm:space-y-5">
          {/* Eyebrow Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-[11px] sm:text-xs font-bold tracking-wider uppercase">
            <HiExclamationCircle aria-hidden="true" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
            <span>{wc.eyebrow[language]}</span>
          </div>

          {/* Main Headline */}
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-deep-navy leading-[1.15] tracking-tight">
            {wc.headlinePart1[language]}
            <span className="text-engineering-blue block sm:inline">
              {wc.headlinePart2[language]}
            </span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed font-normal max-w-3xl">
            {wc.description[language]}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 sm:pt-2">
            <a
              href="/calculator"
              className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-deep-navy text-white text-[11px] sm:text-xs font-bold tracking-wider uppercase transition-colors duration-300 hover:bg-engineering-blue active:scale-95 group"
            >
              <span>{wc.ctaCalculator[language]}</span>
              <HiArrowRight aria-hidden="true" className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            <a
              href="#services"
              className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-5 sm:py-3 rounded-full bg-white border border-gray-200 text-deep-navy text-[11px] sm:text-xs font-bold tracking-wider uppercase transition-all duration-300 hover:bg-gray-50 hover:border-gray-300"
            >
              <span>{wc.ctaSolutions[language]}</span>
            </a>
          </div>
          <p className="text-[11px] sm:text-xs text-gray-500 pt-1">
            {language === "EN" ? "See field proof:" : "Lihat bukti lapangan:"}{" "}
            <a href="#projects" className="font-bold text-[#005B94] underline underline-offset-2 hover:text-[#0077c8]">Maison Horizon 220m • 10m³/h →</a>{" "}
            <span aria-hidden>•</span>{" "}
            <a href="#faq-faq-4" className="font-bold text-[#005B94] underline underline-offset-2 hover:text-[#0077c8]">{language === "EN" ? "SIPA questions" : "Soal SIPA"} →</a>
          </p>
        </div>

        {/* 1/2 Height Image Showcase */}
        <div className="relative w-full min-h-[200px] sm:min-h-[350px] lg:min-h-[450px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-gray-100 group">
          <Image
            src={
              wc.bannerImage ||
              "https://images.unsplash.com/photo-1535868118629-f37bcd69ff59?q=80&w=1176&auto=format&fit=crop"
            }
            alt="Tanker water queue in Pecatu, South Bali — tanker costs vs DRYNO deep well alternative"
            fill
            sizes="(max-width: 1280px) 100vw, 1200px"
            loading="lazy"
            decoding="async"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />

          {/* Vignette Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/90 via-deep-navy/25 to-transparent" />
        </div>

        {/* Reference Articles & Reports List */}
        <div className="mt-5 sm:mt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-3 sm:mb-6">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-engineering-blue uppercase block mb-0.5 sm:mb-1">
                {wc.referencesEyebrow[language]}
              </span>
              <h3 className="text-base sm:text-xl font-bold text-deep-navy">
                {wc.referencesTitle[language]}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5">
            {wc.articles.map((article, index) => {
              const Icon = articleIcons[index % articleIcons.length] || HiNewspaper;
              return (
                <a
                  key={article.id || index}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col justify-between p-3.5 sm:p-5 rounded-2xl bg-white border border-gray-200/80 shadow-sm hover:shadow-lg hover:border-engineering-blue/40 transition-shadow duration-300"
                >
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold border ${article.badgeColor}`}
                      >
                        <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                        <span>{article.type[language]}</span>
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-medium text-gray-500">
                        {article.date[language]}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-base font-bold text-deep-navy group-hover:text-engineering-blue transition-colors leading-snug">
                      {article.publisher[language]}
                    </h4>

                    <p className="text-[11px] sm:text-sm text-gray-600 leading-relaxed font-normal">
                      {article.description[language]}
                    </p>
                  </div>

                  <div className="pt-2.5 sm:pt-4 mt-2.5 sm:mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-engineering-blue group-hover:text-engineering-blue-hover">
                    <span className="text-[10px] sm:text-[11px] text-gray-500 font-mono truncate max-w-[130px] sm:max-w-[150px]">
                      {article.domain}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs">
                      <span>{wc.readArticle[language]}</span>
                      <HiArrowTopRightOnSquare aria-hidden="true" className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
