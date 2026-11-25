"use client";
import React from "react";
import {
  HiArrowRight,
  HiXMark,
  HiCheckCircle,
  HiInformationCircle,
  HiExclamationTriangle,
  HiChartBar,
  HiWrenchScrewdriver,
  HiChatBubbleBottomCenterText,
  HiDocumentCheck,
  HiDocumentText,
  HiCog6Tooth,
} from "react-icons/hi2";
import type { ProductItem, ServicesSectionMeta } from "@/types/cms";
import type { Language } from "@/context/LanguageContext";

export const serviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  investigation: HiChartBar,
  drilling: HiWrenchScrewdriver,
  casing: HiCog6Tooth,
  consultation: HiChatBubbleBottomCenterText,
  sipa: HiDocumentCheck,
  npwpd: HiDocumentText,
};

export function getServiceIcon(id: string) {
  return serviceIcons[id] ?? HiWrenchScrewdriver;
}

export default function ServiceModal({
  service,
  meta,
  language,
  onClose,
}: {
  service: ProductItem;
  meta: ServicesSectionMeta;
  language: Language;
  onClose: () => void;
}) {
  const includes = language === "EN" ? service.includesEN : service.includesID;
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    const fn = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", fn);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-label={service.name[language]}>
      <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
        <button autoFocus onClick={onClose} aria-label="Close" className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
          <HiXMark aria-hidden="true" className="w-5 h-5" />
        </button>
        <span className="text-[11px] font-bold tracking-widest text-gray-500 uppercase">{meta.modalScope[language]}</span>
        <h3 className="text-2xl font-extrabold text-[#0B192C] mt-1 mb-3">{service.name[language]}</h3>
        {(service as { video?: string }).video && (
          <div className="relative mb-4 overflow-hidden rounded-2xl bg-black">
            <video
              src={(service as { video?: string }).video}
              poster={service.image}
              controls
              playsInline
              preload="metadata"
              className="h-56 w-full object-cover sm:h-64"
            />
          </div>
        )}
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{service.fullDesc[language] || service.shortDesc[language]}</p>
        {includes?.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{service.id === "consultation" ? meta.modalConsultation[language] : meta.modalScope[language]}</h4>
          <div className="grid sm:grid-cols-2 gap-2">
            {includes.map((x, i) => (
              <div key={i} className="flex gap-2 p-2.5 rounded-xl bg-gray-50 border text-xs font-semibold text-deep-navy">
                <HiCheckCircle aria-hidden="true" className="w-4 h-4 text-[#0077c8] shrink-0 mt-0.5" />
                <span>{x}</span>
              </div>
            ))}
          </div>
          </div>
        )}
        {service.casingTypes?.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{meta.modalCasing[language]}</h4>
            <div className="flex flex-wrap gap-2">
              {service.casingTypes.map((c, i) => (
                <span key={i} className="px-4 py-2 rounded-xl bg-deep-navy text-white text-xs font-bold uppercase">{c}</span>
              ))}
            </div>
          </div>
        )}
        {service.note?.[language] && (
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 flex gap-3 mb-3">
            <HiInformationCircle aria-hidden="true" className="w-5 h-5 shrink-0" />
            <p className="italic">{service.note[language]}</p>
          </div>
        )}
        {service.id === "sipa" && (
          <div className="mb-4 overflow-hidden rounded-2xl border border-gray-200">
            <div className="bg-deep-navy px-4 py-3">
              <p className="text-[11px] font-bold tracking-widest text-sky-300 uppercase">
                {language === "EN" ? "Issued example — redacted" : "Contoh izin terbit — disamarkan"}
              </p>
              <p className="text-xs text-white/70 mt-0.5">
                {language === "EN"
                  ? "SIPA PB-UMKU (OSS), personal data masked for public display."
                  : "SIPA PB-UMKU (OSS), data pribadi disamarkan untuk publikasi."}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3">
              <a href="/docs/contoh-sipa-pb-umku-censored.pdf" target="_blank" rel="noopener noreferrer" className="group relative block overflow-hidden rounded-xl border bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/sipa-example-p1.jpg" alt={language === "EN" ? "Censored SIPA example page 1" : "Contoh SIPA disamarkan halaman 1"} loading="lazy" className="h-48 w-full object-cover object-top transition-transform group-hover:scale-[1.02]" />
                <span className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold text-white">Hal 1 / Pg 1</span>
              </a>
              <a href="/docs/contoh-sipa-pb-umku-censored.pdf" target="_blank" rel="noopener noreferrer" className="group relative block overflow-hidden rounded-xl border bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/sipa-example-p2.jpg" alt={language === "EN" ? "Censored SIPA example page 2" : "Contoh SIPA disamarkan halaman 2"} loading="lazy" className="h-48 w-full object-cover object-top transition-transform group-hover:scale-[1.02]" />
                <span className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold text-white">Hal 2 / Pg 2</span>
              </a>
            </div>
            <a href="/docs/contoh-sipa-pb-umku-censored.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-white px-4 py-3 text-xs font-bold text-[#0077c8] hover:bg-sky-50">
              <span>{language === "EN" ? "Open full censored PDF (4 pages)" : "Buka PDF lengkap disamarkan (4 halaman)"}</span>
              <HiArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        )}
        {service.id === "npwpd" && (
          <div className="mb-4 overflow-hidden rounded-2xl border border-gray-200">
            <div className="bg-deep-navy px-4 py-3">
              <p className="text-[11px] font-bold tracking-widest text-sky-300 uppercase">
                {language === "EN" ? "Issued example — redacted" : "Contoh SK terbit — disamarkan"}
              </p>
              <p className="text-xs text-white/70 mt-0.5">
                {language === "EN"
                  ? "NPWPD ABT decree + tax card (Bapenda Badung), personal data masked for public display."
                  : "SK NPWPD ABT + kartu NPWPD (Bapenda Badung), data pribadi disamarkan untuk publikasi."}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3">
              <a href="/docs/sk-npwpd-abt-censored.pdf" target="_blank" rel="noopener noreferrer" className="group relative block overflow-hidden rounded-xl border bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/npwpd-example-p1.jpg" alt={language === "EN" ? "Censored NPWPD ABT decree page 1" : "Contoh SK NPWPD ABT disamarkan halaman 1"} loading="lazy" className="h-48 w-full object-cover object-top transition-transform group-hover:scale-[1.02]" />
                <span className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold text-white">Hal 1 / Pg 1</span>
              </a>
              <a href="/docs/sk-npwpd-abt-censored.pdf" target="_blank" rel="noopener noreferrer" className="group relative block overflow-hidden rounded-xl border bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/npwpd-example-p2.jpg" alt={language === "EN" ? "Censored NPWPD ABT tax card page 2" : "Contoh kartu NPWPD disamarkan halaman 2"} loading="lazy" className="h-48 w-full object-cover object-top transition-transform group-hover:scale-[1.02]" />
                <span className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold text-white">Hal 2 / Pg 2</span>
              </a>
            </div>
            <a href="/docs/sk-npwpd-abt-censored.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-white px-4 py-3 text-xs font-bold text-[#0077c8] hover:bg-sky-50">
              <span>{language === "EN" ? "Open full censored PDF (2 pages)" : "Buka PDF lengkap disamarkan (2 halaman)"}</span>
              <HiArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        )}
        {service.disclaimer?.[language] && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex gap-3 mb-4">
            <HiExclamationTriangle aria-hidden="true" className="w-5 h-5 shrink-0" />
            <p className="font-medium">{service.disclaimer[language]}</p>
          </div>
        )}
        <a href="#contact" onClick={onClose} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0B192C] text-white text-xs font-bold uppercase hover:bg-[#0077c8] transition-colors">
          {meta.modalCta[language]} <HiArrowRight aria-hidden="true" className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
