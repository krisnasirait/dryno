"use client";

import React, { useState } from "react";
import {
  HiPlus,
  HiMinus,
  HiChatBubbleLeftEllipsis,
} from "react-icons/hi2";
import { useLanguage } from "@/context/LanguageContext";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { language, content } = useLanguage();
  const faq = content.faq;

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative py-8 sm:py-16 lg:py-24 bg-warm-white text-deep-navy overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2-Column Split Layout: Headline Left, FAQ Accordion Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-16 items-start">
          {/* Column 1: Left Headline & CTA (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6 lg:sticky lg:top-28">
            <div>
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-gray-500 uppercase block mb-1.5 sm:mb-3">
                {faq.eyebrow[language]}
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-deep-navy tracking-tight leading-tight mb-2 sm:mb-4">
                {faq.title[language]}
              </h2>
              <p className="text-xs sm:text-base text-gray-600 font-normal leading-relaxed">
                {faq.subtitle[language]}
              </p>
            </div>

            {/* Left Contact Card */}
            <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-deep-navy to-deep-navy-dark text-white space-y-3 sm:space-y-4 shadow-xl">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-engineering-blue/20 flex items-center justify-center text-engineering-blue-light shrink-0">
                  <HiChatBubbleLeftEllipsis aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white">
                    {language === "EN"
                      ? "Have a specific project question?"
                      : "Punya pertanyaan seputar proyek Anda?"}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-300 font-light">
                    {language === "EN"
                      ? "Our hydrogeology team is ready to consult."
                      : "Tim teknis kami siap memberikan konsultasi."}
                  </p>
                </div>
              </div>

              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-3 rounded-full bg-white text-deep-navy text-[11px] sm:text-xs font-bold tracking-wider uppercase transition-colors duration-300 hover:bg-warm-white shadow-md"
              >
                <span>{faq.ctaButton[language]}</span>
              </a>
            </div>
          </div>

          {/* Column 2: Right FAQ Accordion List (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-2.5 sm:space-y-4">
            {faq.items.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={item.id || index}
                  id={`faq-${item.id}`}
                  className={`rounded-2xl border scroll-mt-28 transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "bg-white border-engineering-blue/30 shadow-md"
                      : "bg-white/80 border-gray-200/80 hover:border-gray-300"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-4 py-3 sm:px-6 sm:py-5 flex items-center justify-between text-left focus:outline-none gap-3 sm:gap-4"
                  >
                    <span className="text-xs sm:text-base font-bold text-deep-navy leading-snug">
                      {item.question[language]}
                    </span>
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
                        isOpen
                          ? "bg-deep-navy text-white"
                          : "bg-gray-100 text-deep-navy group-hover:bg-gray-200"
                      }`}
                    >
                      {isOpen ? (
                        <HiMinus aria-hidden="true" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      ) : (
                        <HiPlus aria-hidden="true" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-3.5 pt-0.5 sm:px-6 sm:pb-6 sm:pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal border-t border-gray-100/60 animate-fadeIn">
                      {item.answer[language]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
