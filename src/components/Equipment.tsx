"use client";

import React from "react";
import Image from "next/image";
import { HiArrowRight } from "react-icons/hi2";
import { useLanguage } from "@/context/LanguageContext";

const categoryID: Record<string, string> = {
  "Ground Water Investigation": "Investigasi Air Tanah",
  "Drilling Equipment": "Peralatan Pengeboran",
  "Supporting Equipment": "Peralatan Pendukung",
  "Drilling Tools": "Mata Bor",
  Casing: "Casing",
};

export default function Equipment() {
  const { language, content } = useLanguage();
  const eq = content.equipment;

  return (
    <section id="equipment" className="relative py-8 sm:py-16 lg:py-20 bg-deep-navy text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-10 items-center">
          <div className="lg:col-span-4 flex flex-col justify-between space-y-3 sm:space-y-6">
            <div>
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-engineering-blue-light uppercase block mb-1.5 sm:mb-3">
                {eq.eyebrow[language]}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight mb-2 sm:mb-4">
                {eq.titleLine1[language]} <br />
                {eq.titleLine2[language]}
              </h2>
              <p className="text-xs sm:text-base text-gray-300 font-light leading-relaxed max-w-md">{eq.desc[language]}</p>
            </div>
            <div>
              <a
                href="#contact"
                className="inline-flex items-center gap-3 px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-full bg-white/10 border border-white/25 text-white text-[11px] sm:text-xs font-bold tracking-wider uppercase transition-colors hover:bg-white hover:text-deep-navy group"
              >
                <span>{eq.cta[language]}</span>
                <HiArrowRight aria-hidden="true" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-8">
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 list-none m-0 p-0">
              {eq.items.map((item) => (
                <li key={item.id} className="flex flex-col">
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-white/5">
                    <Image
                      src={item.image || "/images/eq-admt-site.jpg"}
                      alt={item.title[language]}
                      fill
                      unoptimized={item.image?.startsWith("http") || item.image?.startsWith("/images/uploads/")}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="pt-2 text-left">
                    <p className="text-[10px] font-bold tracking-widest text-engineering-blue-light/80 uppercase">{language === "EN" ? item.category : categoryID[item.category] || item.category}</p>
                    <h3 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2">{item.title[language]}</h3>
                    {(() => {
                      const spec = (item.spec?.[language] || "").trim();
                      const titleEN = (item.title?.EN || "").trim().toLowerCase();
                      const titleID = (item.title?.ID || "").trim().toLowerCase();
                      const specLower = spec.toLowerCase();
                      if (!spec || specLower === titleEN || specLower === titleID) return null;
                      return <p className="text-[11px] font-medium text-gray-400 mt-0.5 line-clamp-2">{spec}</p>;
                    })()}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
