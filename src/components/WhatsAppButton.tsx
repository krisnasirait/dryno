"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

export default function WhatsAppButton() {
  const { language, content } = useLanguage();
  const phoneNumber = content.contact?.whatsappNumber || "6285792096854";
  const defaultMessage = encodeURIComponent(
    language === "ID"
      ? "Halo DRYNO, saya ingin berkonsultasi mengenai proyek air tanah / pengeboran sumur."
      : "Hello DRYNO, I would like to consult regarding ground water / borehole drilling projects."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={
        language === "ID"
          ? "Chat WhatsApp dengan DRYNO"
          : "Chat on WhatsApp with DRYNO"
      }
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl shadow-green-600/30 transition-colors duration-300"
    >
      <FaWhatsapp aria-hidden="true" className="w-6 h-6 text-white" />
    </a>
  );
}
