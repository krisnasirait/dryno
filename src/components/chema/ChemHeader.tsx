"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "../Logo";
import { HiArrowRight, HiBars3, HiXMark, HiChevronDown } from "react-icons/hi2";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/context/translations";

type Sub = { name: string; href: string; desc?: string };
type Item = { key: string; name: string; href: string; subs?: Sub[] };

export default function ChemHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobile, setOpenMobile] = useState<string | null>(null);
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const fn = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const nav: Item[] = [
    {
      key: "solutions", name: language === "EN" ? "Solutions" : "Solusi", href: "/#services",
      subs: [
        { name: language === "EN" ? "Ground Water Investigation" : "Investigasi Air Tanah", href: "/#services" },
        { name: language === "EN" ? "Deep Well Drilling" : "Pengeboran Sumur Dalam", href: "/#services" },
        { name: language === "EN" ? "Well Installation & Casing" : "Instalasi & Casing Sumur", href: "/#services" },
        { name: language === "EN" ? "Technical Consultation" : "Konsultasi Teknis", href: "/#services" },
        { name: "SIPA / NPWPD ABT", href: "/#services" },
      ],
    },
    {
      key: "industries", name: language === "EN" ? "Industries" : "Industri", href: "/#about",
      subs: [
        { name: "Villas & Private Estates", href: "/#about" },
        { name: "Hotels & Resorts", href: "/#about" },
        { name: language === "EN" ? "Residential & Commercial" : "Residensial & Komersial", href: "/#about" },
        { name: language === "EN" ? "Contractors & Developers" : "Kontraktor & Developer", href: "/#projects" },
        { name: language === "EN" ? "Industrial Facilities" : "Fasilitas Industri", href: "/#equipment" },
      ],
    },
    {
      key: "sustain", name: "Sustainability", href: "/#water-challenges",
      subs: [
        { name: language === "EN" ? "Water Challenges in Bali" : "Tantangan Air di Bali", href: "/#water-challenges" },
        { name: language === "EN" ? "Water Tanker Calculator" : "Kalkulator Air Tangki", href: "/calculator" },
      ],
    },
    {
      key: "resources", name: "Resources", href: "/#projects",
      subs: [
        { name: t.nav.projects, href: "/#projects" },
        { name: t.nav.equipment, href: "/#equipment" },
        { name: t.nav.faq, href: "/#faq" },
        { name: t.nav.calculator, href: "/calculator" },
      ],
    },
    {
      key: "about", name: language === "EN" ? "About Us" : "Tentang Kami", href: "/#about",
      subs: [
        { name: t.nav.about, href: "/#about" },
        { name: t.nav.howWeWork, href: "/#how-we-work" },
      ],
    },
    { key: "contact", name: t.nav.contact, href: "/#contact" },
  ];

  return (
    <header id="masthead" className={`sticky top-0 z-50 bg-white transition-all duration-300 ${isScrolled ? "shadow-lg py-2 scrolled" : "py-3 border-b border-gray-100"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" aria-label="DRYNO home"><Logo variant="dark" /></Link>
          <nav className="masthead__nav hidden lg:flex items-center gap-6">
            {nav.map((m) => (
              <div key={m.key} className="menu-item relative group">
                <Link href={m.href} className="menu-item__inner flex items-center gap-1 py-2 text-[13px] font-bold tracking-wide text-gray-800 hover:text-[#005B94]">
                  <span>{m.name}</span>
                  {m.subs && <HiChevronDown className="w-3.5 h-3.5 text-[#005B94] menu-item__chevron transition-transform group-hover:rotate-180" />}
                </Link>
                {m.subs && (
                  <div className="sub-menu__container absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300">
                    <div className="sub-menu__wrapper bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 min-w-[280px]">
                      <ul className="sub-menu space-y-1">
                        {m.subs.map((s) => (
                          <li key={s.name} className="menu-item">
                            <Link href={s.href} className="block px-4 py-2.5 rounded-xl text-[13px] font-semibold text-gray-700 hover:bg-[#005B94]/10 hover:text-[#005B94]">{s.name}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center p-1 rounded-full bg-gray-100 border text-xs font-bold">
              {(["EN", "ID"] as const).map((l) => (
                <button key={l} onClick={() => setLanguage(l)} className={`px-3 py-1 rounded-full transition-all ${language === l ? "bg-[#0B192C] text-white shadow" : "text-gray-500 hover:text-[#0B192C]"}`}>{l}</button>
              ))}
            </div>
            <Link href="/#contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0B192C] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#005B94] transition-colors group">
              <span className="hidden xl:inline">{t.nav.discussProject}</span><span className="xl:hidden">Contact</span>
              <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition-transform"><HiArrowRight className="w-3.5 h-3.5" /></span>
            </Link>
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex p-0.5 rounded-full bg-gray-100 text-[11px] font-bold">
              {(["EN", "ID"] as const).map((l) => (
                <button key={l} onClick={() => setLanguage(l)} className={`px-2.5 py-0.5 rounded-full ${language === l ? "bg-[#0B192C] text-white" : "text-gray-500"}`}>{l}</button>
              ))}
            </div>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="header-menu-toggle p-2 rounded-lg text-[#0B192C] hover:bg-gray-100" aria-label="Toggle menu">
              {mobileOpen ? <HiXMark className="w-6 h-6" /> : <HiBars3 className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div className="header-main-menu show-menu lg:hidden bg-[#0B192C] text-white border-t border-white/10 max-h-[80vh] overflow-y-auto">
          <div className="masthead__menu px-5 py-4 space-y-1">
            {nav.map((m) => (
              <div key={m.key} className="menu-item-has-children border-b border-white/5 last:border-0">
                <div className="menu-item__inner flex items-center justify-between py-2.5" onClick={() => m.subs && setOpenMobile(openMobile === m.key ? null : m.key)}>
                  <Link href={m.href} onClick={() => setMobileOpen(false)} className="text-sm font-bold tracking-wide">{m.name}</Link>
                  {m.subs && <HiChevronDown className={`w-4 h-4 transition-transform ${openMobile === m.key ? "rotate-180" : ""}`} />}
                </div>
                {m.subs && openMobile === m.key && (
                  <div className="sub-menu__container active pb-3 pl-3 space-y-1">
                    {m.subs.map((s) => (
                      <Link key={s.name} href={s.href} onClick={() => setMobileOpen(false)} className="block py-1.5 text-[13px] text-white/70 hover:text-white">{s.name}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link href="/#contact" onClick={() => setMobileOpen(false)} className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-full bg-engineering-blue text-white text-xs font-bold uppercase">{t.nav.discussProject}<HiArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      )}
    </header>
  );
}
