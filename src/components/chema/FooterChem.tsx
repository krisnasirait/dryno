"use client";
import React from "react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { HiEnvelope } from "react-icons/hi2";
import { useLanguage } from "@/context/LanguageContext";

export default function FooterChem() {
  const { language, content } = useLanguage();
  const contact = content.contact;
  const wa = `https://wa.me/${contact?.whatsappNumber || "6285792096854"}`;
  const [year, setYear] = React.useState(2026);
  // Year must render on mount (SSR-safe) — intentional client sync.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setYear(new Date().getFullYear()), []);
  return (
    <footer className="relative bg-[#0077c8] text-white overflow-hidden">
      <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-white/15 blur-2xl pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-3 gap-10">
        <nav aria-label="Explore">
          <h4 className="font-bold mb-4">{language === "EN" ? "Explore DRYNO" : "Jelajahi DRYNO"}</h4>
          <ul className="space-y-2 text-sm text-white/85 underline-offset-2">
            {[["Services & Solutions", "/#services"], ["Projects", "/#projects"], ["Equipment", "/#equipment"], ["About Us", "/#about"], ["How We Work", "/#how-we-work"], ["Contact Us", "/#contact"], ["Sitemap", "/sitemap.xml"]].map(([n, h]) => (
              <li key={n}><Link href={h} className="hover:underline underline">{n}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <h4 className="font-bold mb-4">{language === "EN" ? "Using Our Website" : "Menggunakan Situs Ini"}</h4>
          <ul className="space-y-2 text-sm text-white/85">
            <li><Link href="/#faq" className="underline">{language === "EN" ? "Privacy Statement" : "Pernyataan Privasi"}</Link></li>
            <li><Link href="/#faq" className="underline">{language === "EN" ? "Terms & Conditions" : "Syarat & Ketentuan"}</Link></li>
            <li className="pt-3 text-white/70 text-xs">{contact.coverage}</li>
            <li className="text-white/70 text-xs">{contact.phoneDisplay} • {contact.email}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">{language === "EN" ? "Stay Connected" : "Tetap Terhubung"}</h4>
          <div className="flex gap-3">
            <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp DRYNO engineers" className="w-11 h-11 rounded-full bg-white text-[#0077c8] flex items-center justify-center hover:scale-110 transition-transform"><FaWhatsapp className="w-5 h-5" /></a>
            <a href={`mailto:${contact.email}`} aria-label="Email DRYNO" className="w-11 h-11 rounded-full bg-white text-[#0077c8] flex items-center justify-center hover:scale-110 transition-transform"><HiEnvelope className="w-5 h-5" /></a>
            <Link href="/#contact" aria-label="Contact form" className="h-11 px-5 rounded-full bg-white/15 border border-white/30 text-white text-xs font-bold uppercase tracking-wider flex items-center hover:bg-white/25 transition-colors">Contact</Link>
          </div>
          <p className="mt-4 text-xs text-white/70 max-w-xs">{contact.footerBrandDesc[language]}</p>
        </div>
      </div>
      <div className="relative border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/80">
          <p>Copyright © {year} DRYNO — Engineering Water Solution. All Rights Reserved.</p>
          <p className="font-bold tracking-widest">DRYNO</p>
        </div>
      </div>
    </footer>
  );
}
