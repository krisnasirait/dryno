"use client";

import React from "react";
import {
  HiUserGroup,
  HiSparkles,
  HiDocumentChartBar,
  HiCog6Tooth,
  HiWrenchScrewdriver,
  HiShieldCheck,
} from "react-icons/hi2";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/context/translations";

const stepIcons = [
  HiUserGroup,
  HiSparkles,
  HiDocumentChartBar,
  HiCog6Tooth,
  HiWrenchScrewdriver,
  HiShieldCheck,
];

export default function HowWeWork() {
  const { language } = useLanguage();
  const t = translations[language].howWeWork;

  return (
    <section id="how-we-work" className="relative py-8 sm:py-16 bg-deep-navy text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 sm:mb-14 pb-3 sm:pb-6 border-b border-white/10 gap-2">
          <div>
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-engineering-blue-light uppercase block mb-1 sm:mb-2">
              {t.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">{t.title}</h2>
          </div>
          <p className="text-xs sm:text-base text-gray-300 font-light max-w-md">{t.subtitle}</p>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 list-none m-0 p-0">
          {t.steps.map((step, idx) => {
            const Icon = stepIcons[idx] || HiUserGroup;
            return (
              <li key={step.number} className="rounded-2xl bg-white/5 border border-white/10 p-5 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl font-extrabold text-white/15 tabular-nums leading-none" aria-hidden>
                    {step.number}
                  </span>
                  <span className="w-10 h-10 rounded-full bg-[#0077c8]/20 border border-[#0077c8]/30 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-sky-300" aria-hidden />
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1 leading-snug">{step.title}</h3>
                <p className="text-[13px] text-gray-300 leading-relaxed font-light">{step.desc}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
