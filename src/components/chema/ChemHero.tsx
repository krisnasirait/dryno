"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { HiArrowUpRight } from "react-icons/hi2";
import { useLanguage } from "@/context/LanguageContext";

export default function ChemHero() {
  const { language, content } = useLanguage();
  const hero = content.hero;
  const [slide, setSlide] = useState(0);
  const images = hero.images?.length ? hero.images : [{ id: "01", src: "/images/hero-site-pecatu.jpg", alt: "DRYNO" }];
  const portraits = [
    "/images/hero-potrait/hero-site-tech.jpg",
    "/images/hero-potrait/hero-mast-fira.jpg",
    "/images/hero-potrait/hero-rig-blue.jpg",
  ];

  useEffect(() => {
    const current = images[slide % images.length];
    const isVideo = current?.src?.endsWith(".mp4");
    const id = setTimeout(
      () => setSlide((s) => (s + 1) % images.length),
      isVideo ? 12000 : 6000
    );
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide, images.length]);

  const links = [
    { key: "Investigate", descEN: "Map aquifers with a geoelectric survey before you drill.", descID: "Petakan akuifer lewat survei geolistrik sebelum mengebor.", href: "#services" },
    { key: "Drill", descEN: "See 220 m of hard-rock drilling in Uluwatu.", descID: "Lihat pengeboran 220 m di batuan Uluwatu.", href: "#projects" },
    { key: "Install", descEN: "Casing and construction built for decades.", descID: "Casing dan konstruksi untuk puluhan tahun.", href: "#equipment" },
    { key: "Permit", descEN: "SIPA and NPWPD ABT, handled for you.", descID: "SIPA dan NPWPD ABT, kami yang mengurus.", href: "#contact" },
  ];

  return (
    <section id="home" className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#06121f] text-white">
      <div className="absolute inset-0 z-0">
        {images.map((img, i) =>
          i !== slide ? null : (() => {
            const isVideo = img.src.endsWith(".mp4");
            if (isVideo) {
              return (
                <div key={img.id || i} className="absolute inset-0">
                  <video
                    src={img.src}
                    poster="/images/service-drilling-video-poster.jpg"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={img.alt || "DRYNO"}
                    className={`object-cover object-center scale-105 h-full w-full ${i === 0 ? "" : "hero-fade-in"}`}
                  />
                </div>
              );
            }
            return (
              <div key={img.id || i} className="absolute inset-0">
              <Image
                src={portraits[i % portraits.length]}
                alt={img.alt || "DRYNO"}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                priority={i === 0}
                fetchPriority="high"
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className={`object-cover object-center scale-105 md:hidden ${i === 0 ? "" : "hero-fade-in"}`}
              />
              <Image
                src={img.src}
                alt={img.alt || "DRYNO"}
                fill
                sizes="100vw"
                priority={i === 0}
                fetchPriority="high"
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className={`object-cover scale-105 hidden md:block ${i === 0 ? "" : "hero-fade-in"}`}
                unoptimized={img.src.startsWith("http") || img.src.startsWith("/images/uploads/")}
              />
            </div>
            );
          })()
        )}
      </div>
      <div className="absolute inset-0 z-[1] pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-r from-[#06121f]/95 via-[#0B192C]/80 to-[#0B192C]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06121f] via-transparent to-[#06121f]/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-[1.2fr_.8fr] gap-10 py-20">
        <div data-aos="fade-up">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-[2px] bg-sky-400" />
            <span className="text-[11px] sm:text-sm font-bold tracking-[0.25em] uppercase text-white/80">{hero.tagline[language]}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight mb-5 drop-shadow-lg">{hero.headline[language]}</h1>
          <p className="text-white/75 text-sm sm:text-lg font-light max-w-xl mb-8">{hero.description[language]}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="#contact" className="inline-flex items-center justify-between gap-3 px-7 py-4 rounded-full bg-white text-[#0B192C] font-bold text-xs sm:text-sm uppercase tracking-wider hover:shadow-2xl transition-shadow group w-full sm:w-auto">
              <span>{hero.ctaDiscuss[language]}</span>
              <span className="w-8 h-8 rounded-full bg-[#0B192C] text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a href="#services" className="inline-flex items-center justify-between gap-3 px-7 py-4 rounded-full border border-white/40 bg-white/10 backdrop-blur font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-white/20 transition-all w-full sm:w-auto">
              <span>{hero.ctaServices[language]}</span><span>→</span>
            </a>
          </div>
          <div className="mt-8 text-[11px] sm:text-xs font-bold tracking-[0.2em] text-white/80">{hero.location}</div>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm" data-aos="fade-up">
            <a href="#projects" className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1.5 font-bold text-white hover:bg-white/20 transition-colors">
              <span className="text-sky-300">10+ years</span><span className="text-white/75">•</span><span>220 m Uluwatu</span><span className="text-white/75">•</span><span>10 m³/h</span><span aria-hidden>→</span>
            </a>
            <a href="#faq-faq-4" className="underline underline-offset-4 text-white/80 hover:text-white">SIPA handled for you — see FAQ</a>
          </div>
        </div>

        <div className="hidden md:flex flex-col justify-center gap-0 border-l border-white/20 pl-8" data-aos="fade-left">
          {links.map((l) => (
            <a key={l.key} href={l.href} className="group py-5 border-b border-white/20 last:border-0 flex items-start gap-4 hover:pl-2 transition-all">
              <span className="w-10 h-10 rounded-full bg-[#0077c8] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><HiArrowUpRight aria-hidden="true" className="w-5 h-5" /></span>
              <span>
                <span className="block text-2xl font-bold">{l.key}</span>
                <span className="block text-white/75 text-sm">{language === "EN" ? l.descEN : l.descID}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
