"use client";

import React, { useState } from "react";
import {
  HiPaperAirplane,
  HiMapPin,
  HiPhone,
  HiEnvelope,
  HiCheckCircle,
  HiShieldCheck,
} from "react-icons/hi2";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/context/translations";

export default function Contact() {
  const { language, content } = useLanguage();
  const t = translations[language].contact;
  const contact = content.contact;

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    location: "",
    projectType:
      language === "EN" ? "Villa / Private Estate" : "Vila / Hunian Pribadi",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const projectTypes =
    language === "EN"
      ? [
          "Villa / Private Estate",
          "Hotel / Resort",
          "Residential & Commercial",
          "Contractor / Developer",
          "Industrial Facility",
          "Other",
        ]
      : [
          "Vila / Hunian Pribadi",
          "Hotel / Resor",
          "Residensial & Komersial",
          "Kontraktor / Pengembang",
          "Fasilitas Industri",
          "Lainnya",
        ];

  return (
    <section
      id="contact"
      className="relative py-8 sm:py-16 lg:py-24 bg-white text-deep-navy overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navy Card Container */}
        <div className="relative rounded-3xl bg-deep-navy text-white p-4 sm:p-12 lg:p-16 shadow-2xl overflow-hidden">

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-16 items-start">
            {/* Left Side: Header & Info (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-8 flex flex-col justify-between h-full">
              <div>
                {/* Category Tagline */}
                <div className="flex items-center gap-2 mb-2 sm:mb-4">
                  <span className="w-5 sm:w-8 h-[2px] bg-engineering-blue-light" />
                  <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-engineering-blue-light uppercase">
                    {contact.eyebrow[language]}
                  </span>
                </div>

                {/* Main CTA Heading */}
                <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight uppercase tracking-tight mb-2 sm:mb-6">
                  {contact.title[language]}
                </h2>

                <p className="text-xs sm:text-base text-gray-300 font-light leading-relaxed">
                  {contact.desc[language]}
                </p>
              </div>

              {/* Direct Info Badges */}
              <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-white/10">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-engineering-blue-light shrink-0">
                    <HiMapPin aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h3 className="text-[10px] sm:text-xs font-bold text-gray-300 uppercase tracking-wider">
                      {language === "EN" ? "OPERATIONAL COVERAGE" : "CAKUPAN OPERASIONAL"}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-white">
                      {contact.coverage}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-engineering-blue-light shrink-0">
                    <HiPhone aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h3 className="text-[10px] sm:text-xs font-bold text-gray-300 uppercase tracking-wider">
                      {language === "EN" ? "DIRECT WHATSAPP & PHONE" : "WHATSAPP & TELEPON LANGSUNG"}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-white">
                      {contact.phoneDisplay}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-engineering-blue-light shrink-0">
                    <HiEnvelope aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h3 className="text-[10px] sm:text-xs font-bold text-gray-300 uppercase tracking-wider">
                      {language === "EN" ? "EMAIL INQUIRIES" : "PERTANYAAN EMAIL"}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-white">
                      {contact.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5 sm:gap-3">
                <HiShieldCheck aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5 text-engineering-blue-light shrink-0" />
                <p className="text-[11px] sm:text-xs text-gray-300">
                  {contact.experienceHighlight[language]}
                </p>
              </div>
            </div>

            {/* Right Side: Contact Form (lg:col-span-7) */}
            <div className="lg:col-span-7">
              {submitted ? (
                <div className="p-8 sm:p-12 rounded-2xl bg-white/5 border border-white/10 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-engineering-blue-light/20 text-engineering-blue-light flex items-center justify-center mx-auto">
                    <HiCheckCircle aria-hidden="true" className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">
                    {t.formSuccessTitle}
                  </h3>
                  <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
                    {t.formSuccessDesc}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 rounded-full bg-white text-deep-navy text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    {t.formReset}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                    {/* Name */}
                    <div>
                      <label htmlFor="contact-name" className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-300 mb-1 sm:mb-2">
                        {t.formName} *
                      </label>
                      <input
                        type="text"
                        required
                        id="contact-name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3.5 rounded-xl bg-white border border-white/20 text-deep-navy placeholder-gray-500 focus:outline-none focus:border-engineering-blue-light transition-all text-xs sm:text-sm"
                      />
                    </div>

                    {/* Company / Project Name */}
                    <div>
                      <label htmlFor="contact-company" className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-300 mb-1 sm:mb-2">
                        {t.formCompany} *
                      </label>
                      <input
                        type="text"
                        required
                        id="contact-company"
                        placeholder="Property / project name"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3.5 rounded-xl bg-white border border-white/20 text-deep-navy placeholder-gray-500 focus:outline-none focus:border-engineering-blue-light transition-all text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                    {/* Project Location */}
                    <div>
                      <label htmlFor="contact-location" className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-300 mb-1 sm:mb-2">
                        {t.formLocation} *
                      </label>
                      <input
                        type="text"
                        required
                        id="contact-location"
                        placeholder="Pecatu, Uluwatu, Bali"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3.5 rounded-xl bg-white border border-white/20 text-deep-navy placeholder-gray-500 focus:outline-none focus:border-engineering-blue-light transition-all text-xs sm:text-sm"
                      />
                    </div>

                    {/* Project Type */}
                    <div>
                      <label htmlFor="contact-type" className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-300 mb-1 sm:mb-2">
                        {t.formProjectType} *
                      </label>
                      <select
                        id="contact-type"
                        value={formData.projectType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            projectType: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3.5 rounded-xl bg-white border border-white/20 text-deep-navy focus:outline-none focus:border-engineering-blue-light text-xs sm:text-sm cursor-pointer"
                      >
                        {projectTypes.map((type) => (
                          <option
                            key={type}
                            value={type}
                            className="bg-white text-deep-navy"
                          >
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="contact-message" className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-300 mb-1 sm:mb-2">
                      {t.formMessage} *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={3}
                      required
                      placeholder={
                        language === "EN"
                          ? "Tell us about your water requirements, site conditions, or specific service needs..."
                          : "Ceritakan kebutuhan debit air, kondisi tapak proyek, atau layanan yang dibutuhkan..."
                      }
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3.5 rounded-xl bg-white border border-white/20 text-deep-navy placeholder-gray-500 focus:outline-none focus:border-engineering-blue-light transition-all text-xs sm:text-sm resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2.5 py-3 sm:py-4 rounded-xl bg-engineering-blue hover:bg-engineering-blue-light text-white text-xs font-extrabold tracking-wider uppercase transition-[background-color,box-shadow] duration-300 hover:shadow-lg hover:shadow-engineering-blue/30 group cursor-pointer"
                  >
                    <span>{t.formSubmit}</span>
                    <HiPaperAirplane aria-hidden="true" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
