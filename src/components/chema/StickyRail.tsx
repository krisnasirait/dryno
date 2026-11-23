"use client";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { HiEnvelope } from "react-icons/hi2";
import { useLanguage } from "@/context/LanguageContext";

export default function StickyRail() {
  const { language, content } = useLanguage();
  const wa = `https://wa.me/${content.contact?.whatsappNumber || "6285792096854"}`;
  const mail = `mailto:${content.contact?.email || "info@drynotech.com"}`;
  return (
    <div data-aos="fade-left" className="cta-contact-sticky hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 flex-col items-center bg-[#0077c8] text-white rounded-l-2xl py-3 px-2 gap-3 shadow-2xl">
      <Link href="/#contact" aria-label="Contact options" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 font-black">+</Link>
      <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp DRYNO engineers" className="w-8 h-8 rounded-full bg-white text-[#0077c8] flex items-center justify-center hover:scale-110 transition-transform"><FaWhatsapp className="w-4 h-4" /></a>
      <a href={mail} aria-label="Email DRYNO" className="w-8 h-8 rounded-full bg-white text-[#0077c8] flex items-center justify-center hover:scale-110 transition-transform"><HiEnvelope className="w-4 h-4" /></a>
      <Link href="/#contact" className="text-[11px] font-bold tracking-widest uppercase" style={{ writingMode: "vertical-rl" }}>{language === "EN" ? "Contact Us" : "Hubungi Kami"}</Link>
    </div>
  );
}
