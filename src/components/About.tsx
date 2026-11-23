"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  HiArrowRight,
  HiMapPin,
  HiBriefcase,
  HiCog6Tooth,
  HiArrowPath,
  HiShieldCheck,
  HiBuildingOffice2,
  HiHomeModern,
  HiWrenchScrewdriver,
  HiChevronUp,
} from "react-icons/hi2";
import { useLanguage } from "@/context/LanguageContext";

export default function About() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { language, content } = useLanguage();
  const about = content.about;

  const clientTypes = [
    {
      label:
        language === "EN"
          ? "Villas & Private Estates"
          : "Vila & Hunian Pribadi",
      icon: HiHomeModern,
    },
    {
      label: language === "EN" ? "Hotels & Resorts" : "Hotel & Resor",
      icon: HiBuildingOffice2,
    },
    {
      label:
        language === "EN"
          ? "Residential & Commercial"
          : "Residensial & Komersial",
      icon: HiBuildingOffice2,
    },
    {
      label:
        language === "EN"
          ? "Contractors & Developers"
          : "Kontraktor & Pengembang",
      icon: HiWrenchScrewdriver,
    },
    {
      label:
        language === "EN" ? "Industrial Facilities" : "Fasilitas Industri",
      icon: HiBriefcase,
    },
  ];

  return (
    <section
      id="about"
      className="relative py-8 sm:py-16 lg:py-24 bg-white overflow-hidden text-deep-navy"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 3-Column Top Layout Matching Design Reference */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-12 items-stretch">
          {/* Column 1: Main Header & Intro Text (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4 sm:space-y-6">
            <div>
              {/* Category Tagline */}
              <span className="text-xs font-bold tracking-[0.25em] text-gray-500 uppercase block mb-2 sm:mb-3">
                {about.category[language]}
              </span>

              {/* Main Heading */}
              <h2 className="text-4xl lg:text-5xl font-bold text-deep-navy leading-[1.12] tracking-tight mb-2 lg:mb-6">
                {about.titleLine1[language]} <br />
                {about.titleLine2[language]} <br />
                {about.titleLine3[language]}
              </h2>

              {/* Core Description */}
              <p className="text-xs sm:text-base text-gray-600 leading-relaxed font-normal">
                {about.description[language]}
              </p>
            </div>

            {/* Learn More Button */}
            <div className="pt-1 sm:pt-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-3 sm:gap-4 px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-full bg-deep-navy text-white text-[11px] sm:text-xs font-bold tracking-wider uppercase transition-colors duration-300 hover:bg-engineering-blue group"
              >
                <span>
                  {isExpanded
                    ? about.showLess[language]
                    : about.learnMore[language]}
                </span>
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                  {isExpanded ? (
                    <HiChevronUp aria-hidden="true" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                  ) : (
                    <HiArrowRight aria-hidden="true" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Column 2: Highlights & Badges List (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col justify-center space-y-4 sm:space-y-7 border-y lg:border-y-0 lg:border-x border-gray-100 py-4 sm:py-6 lg:py-0 lg:px-8">
            {/* Highlight 1: Years Experience */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="text-4xl font-extrabold text-deep-navy leading-none">
                {about.yearsExperience}
              </div>
              <div className="text-[11px] sm:text-xs font-semibold text-gray-600 leading-tight whitespace-pre-line">
                {about.fieldExp[language]}
              </div>
            </div>

            {/* Highlight 2: Service Coverage */}
            <div className="flex items-start gap-3 sm:gap-3.5 pt-1 sm:pt-2">
              <div className="p-2 sm:p-2.5 rounded-xl bg-engineering-blue/10 text-engineering-blue shrink-0">
                <HiMapPin aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-deep-navy">
                  {about.coverageLine1}
                </div>
                <div className="text-[11px] sm:text-xs font-medium text-gray-500">
                  {about.coverageLine2}
                </div>
              </div>
            </div>

            {/* Highlight 3: Project-Based Approach */}
            <div className="flex items-start gap-3 sm:gap-3.5 pt-1">
              <div className="p-2 sm:p-2.5 rounded-xl bg-engineering-blue/10 text-engineering-blue shrink-0">
                <HiBriefcase aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-deep-navy whitespace-pre-line">
                  {about.approach[language]}
                </div>
              </div>
            </div>

            {/* Highlight 4: Technical & Regulatory Support */}
            <div className="flex items-start gap-3 sm:gap-3.5 pt-1">
              <div className="p-2 sm:p-2.5 rounded-xl bg-engineering-blue/10 text-engineering-blue shrink-0">
                <HiCog6Tooth aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-deep-navy whitespace-pre-line">
                  {about.technical[language]}
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Featured Coastal Image Container (lg:col-span-4) */}
          <div className="lg:col-span-4 relative min-h-[200px] sm:min-h-[320px] lg:min-h-[380px] rounded-2xl overflow-hidden shadow-xl group">
            <Image
              src={about.image || "/images/about-villa.jpg"}
              sizes="(max-width: 1024px) 100vw, 40vw"
              decoding="async"
              alt="Deep-well drilling rig at work in Pecatu, Uluwatu — DRYNO Bali"
              fill
              unoptimized={
                about.image?.startsWith("http") ||
                about.image?.startsWith("/images/uploads/")
              }
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/90 via-deep-navy/30 to-transparent" />

            {/* Overlay Text */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 z-10 text-white">
              <h3 className="text-lg sm:text-2xl font-extrabold tracking-tight leading-tight mb-2 sm:mb-3 drop-shadow-md max-w-[240px]">
                {about.bannerOverlayText[language]}
              </h3>
              <div className="w-1/2 h-1 bg-engineering-blue-light rounded-full" />
            </div>
          </div>
        </div>

        {/* Expanded Details Section */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            isExpanded
              ? "max-h-[2000px] opacity-100 mt-6 sm:mt-16 pt-6 sm:pt-12 border-t border-gray-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            {/* Expanded Card 1: Sectors We Serve */}
            <div className="border-t-2 border-deep-navy/10 pt-4 sm:pt-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-engineering-blue/10 flex items-center justify-center text-engineering-blue">
                    <HiBuildingOffice2 aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="text-sm sm:text-base font-extrabold text-deep-navy uppercase tracking-wider">
                    {about.sectorsTitle[language]}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4 sm:mb-6 font-normal">
                  {about.sectorsDesc[language]}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-2">
                {clientTypes.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-white border border-gray-200 text-[11px] sm:text-xs font-semibold text-deep-navy"
                  >
                    <item.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-engineering-blue" />
                    {item.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Expanded Card 2: Systematic Approach */}
            <div className="border-t-2 border-deep-navy/10 pt-4 sm:pt-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-engineering-blue/10 flex items-center justify-center text-engineering-blue">
                    <HiArrowPath aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="text-base font-extrabold text-deep-navy uppercase tracking-wider">
                    {about.processTitle[language]}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4 sm:mb-6 font-normal">
                  {about.processDesc[language]}
                </p>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-white border border-gray-200/80">
                <div className="text-xs font-bold text-deep-navy mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-engineering-blue-light" />
                  {about.dataDrivenTitle[language]}
                </div>
                <p className="text-[11px] sm:text-xs text-gray-500">
                  {about.dataDrivenDesc[language]}
                </p>
              </div>
            </div>

            {/* Expanded Card 3: Permitting & Legal Compliance */}
            <div className="border-t-2 border-deep-navy/10 pt-4 sm:pt-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-engineering-blue/10 flex items-center justify-center text-engineering-blue">
                    <HiShieldCheck aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="text-sm sm:text-base font-extrabold text-deep-navy uppercase tracking-wider">
                    {about.permitTitle[language]}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4 sm:mb-6 font-normal">
                  {about.permitDesc[language]}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-deep-navy text-white text-[11px] sm:text-xs font-bold tracking-wider uppercase shadow-sm">
                  {language === "EN" ? "SIPA PERMIT" : "IZIN SIPA"}
                </span>
                <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-engineering-blue text-white text-[11px] sm:text-xs font-bold tracking-wider uppercase shadow-sm">
                  {language === "EN" ? "NPWPD ABT" : "PAJAK ABT"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
