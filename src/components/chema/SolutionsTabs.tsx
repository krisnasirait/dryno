"use client";
import React, { useState } from "react";
import Image from "next/image";
import { HiArrowRight, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useLanguage } from "@/context/LanguageContext";
import ServiceModal, { getServiceIcon } from "@/components/ServiceModal";

const categoryID: Record<string, string> = {
  Investigation: "Investigasi",
  Drilling: "Pengeboran",
  Installation: "Instalasi",
  Consultation: "Konsultasi",
  Permitting: "Perizinan",
};

export default function SolutionsTabs() {
  const { language, content } = useLanguage();
  const [idx, setIdx] = useState(0);
  const [modal, setModal] = useState(false);
  const meta = content.servicesMeta;
  const items = content.products.filter((p) => p.status !== "Draft");

  // Deep-link support: /#services-sipa, /#services-drilling, etc. (header dropdown)
  React.useEffect(() => {
    const applyHashValue = (h: string) => {
      if (!h.startsWith("services")) return;
      const parts = h.split("-");
      const serviceId = parts.length > 1 ? parts.slice(1).join("-") : "";
      if (!serviceId) return;
      const found = items.findIndex((p) => p.id === serviceId);
      if (found >= 0) {
        setIdx(found);
        document.getElementById("services")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    const applyHash = () => applyHashValue(window.location.hash.replace("#", ""));
    const onCustom = (e: Event) => applyHashValue((e as CustomEvent<string>).detail ?? "");
    applyHash();
    window.addEventListener("hashchange", applyHash);
    window.addEventListener("popstate", applyHash);
    window.addEventListener("dryno:select-service", onCustom);
    return () => {
      window.removeEventListener("hashchange", applyHash);
      window.removeEventListener("popstate", applyHash);
      window.removeEventListener("dryno:select-service", onCustom);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const selectService = (i: number) => {
    setIdx(i);
    const id = items[i]?.id;
    if (id && typeof window !== "undefined") {
      window.history.replaceState(null, "", `#services-${id}`);
    }
  };

  const cur = items[Math.min(idx, items.length - 1)];
  // Real document screenshots always win over CMS/AI images for permit services.
  const docImageOverride: Record<string, string> = {
    sipa: "/images/service-sipa-doc.png",
    npwpd: "/images/service-npwpd-doc.png",
  };
  const curImage = docImageOverride[cur.id] || cur.image;
  if (!cur) return null;

  const go = (d: number) => {
    const next = (idx + d + items.length) % items.length;
    selectService(next);
  };
  const progress = ((idx + 1) / items.length) * 100;

  return (
    <section id="services" className="relative py-14 sm:py-20 bg-white overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8" data-aos="fade-up">
          <span className="text-[11px] font-bold tracking-[0.25em] text-gray-500 uppercase">{meta.eyebrow[language]}</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0B192C] tracking-tight mt-2">{meta.title[language]}</h2>
          <p className="text-gray-600 mt-3">{meta.subtitle[language]}</p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2" data-aos="fade-up" role="tablist" aria-label={meta.title[language]}>
            {items.map((s, i) => {
              const Icon = getServiceIcon(s.id);
              const active = i === idx;
              return (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => selectService(i)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-colors ${
                    active ? "bg-[#0077c8] text-white border-[#0077c8] shadow-md" : "bg-gray-50 text-gray-700 border-gray-100 hover:border-[#0077c8]/40"
                  }`}
                >
                  <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${active ? "bg-white text-[#0077c8]" : "bg-[#0077c8]/10 text-[#0077c8]"}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span>
                    <span className={`block text-[10px] font-bold tracking-widest ${active ? "text-white/80" : "text-gray-500"}`}>{s.number} — {language === "EN" ? s.category : categoryID[s.category] || s.category}</span>
                    <span className="block text-[13px] font-bold leading-tight">{s.name[language]}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-[#0B192C] text-white min-h-[420px] flex" data-aos="fade-left">
            <div key={cur.id} className="relative w-full grid md:grid-cols-2">
              <div className="relative h-60 sm:h-72 md:h-auto md:min-h-[420px] bg-black">
                {((cur as { video?: string }).video || (cur.id === "drilling" ? "/videos/drilling-field-nov2026.mp4" : "")) ? (
                  <video
                    key={cur.id}
                    src={(cur as { video?: string }).video || "/videos/drilling-field-nov2026.mp4"}
                    poster={curImage}
                    controls
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <Image src={curImage} alt={cur.name[language]} fill sizes="(max-width: 768px) 100vw, 50vw" priority decoding="async" className="object-cover" unoptimized={cur.image?.startsWith("http") || cur.image?.startsWith("/images/uploads/")} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-[#0B192C]/20 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#0B192C] pointer-events-none" />
              </div>
              <div className="p-6 sm:p-10 flex flex-col justify-center">
                <span className="text-[11px] font-bold tracking-[0.25em] text-sky-300 uppercase">SERVICE {cur.number} — {language === "EN" ? cur.category : categoryID[cur.category] || cur.category}</span>
                <h3 className="text-2xl sm:text-4xl font-extrabold mt-2 mb-3">{cur.name[language]}</h3>
                <p className="text-white/80 text-sm sm:text-base mb-4">{cur.shortDesc?.[language]}</p>
                <div className="mb-4">
                  <span className="text-xl font-extrabold text-sky-300">{cur.price[language]}</span>
                  <span className="text-[11px] text-white/70 ml-2">{cur.priceLabel[language]}</span>
                </div>
                <p className="text-xs text-white/75 mb-6">
                  {language === "EN" ? "Permits confusing?" : "Bingung soal izin?"}{" "}
                  <a href="#faq-faq-4" className="font-bold text-sky-300 underline underline-offset-2 hover:text-white">
                    {language === "EN" ? "SIPA explained in FAQ →" : "SIPA dijelaskan di FAQ →"}
                  </a>
                </p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setModal(true)} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#0B192C] text-xs font-bold uppercase tracking-wider hover:bg-sky-100 transition-colors">
                    {language === "EN" ? "See details" : "Lihat detail"} <HiArrowRight aria-hidden="true" className="w-4 h-4" />
                  </button>
                  <div className="flex gap-2 ml-auto">
                    <button onClick={() => go(-1)} aria-label="Previous service" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/20 transition-colors">
                      <HiChevronLeft aria-hidden="true" className="w-5 h-5" />
                    </button>
                    <button onClick={() => go(1)} aria-label="Next service" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/20 transition-colors">
                      <HiChevronRight aria-hidden="true" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <span className="text-xs font-bold text-white/75 tabular-nums">{String(idx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
                  <div className="flex-1 h-1 rounded-full bg-white/15 overflow-hidden" role="progressbar" aria-label={language === "EN" ? `Service ${idx + 1} of ${items.length}` : `Layanan ${idx + 1} dari ${items.length}`} aria-valuenow={idx + 1} aria-valuemin={1} aria-valuemax={items.length} aria-valuetext={cur.name[language]}>
                    <div className="h-full bg-sky-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modal && <ServiceModal service={cur} meta={meta} language={language} onClose={() => setModal(false)} />}
    </section>
  );
}
