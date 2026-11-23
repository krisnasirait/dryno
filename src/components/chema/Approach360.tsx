"use client";
import { useLanguage } from "@/context/LanguageContext";
import { HiMagnifyingGlass, HiWrenchScrewdriver, HiCheckBadge } from "react-icons/hi2";

export default function Approach360() {
  const { language, content } = useLanguage();
  const about = content.about;
  return (
    <section className="py-14 sm:py-20 bg-[#FAF9F6] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
        <div className="relative flex justify-center" data-aos="fade-up">
          <div className="relative w-[300px] h-[300px] sm:w-[420px] sm:h-[420px]">
            <div className="absolute inset-0 rounded-full border-[10px] border-[#0077c8]/15" />
            <div className="absolute inset-6 rounded-full overflow-hidden shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={about.image} alt="DRYNO" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-[#0077c8]/20" />
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-[#0077c8] text-white flex items-center justify-center shadow-xl"><HiMagnifyingGlass className="w-7 h-7" /></div>
            <div className="absolute bottom-6 -left-2 w-16 h-16 rounded-full bg-white border-2 border-[#0077c8]/20 flex items-center justify-center shadow-xl"><HiWrenchScrewdriver className="w-7 h-7 text-[#0077c8]" /></div>
            <div className="absolute bottom-6 -right-2 w-16 h-16 rounded-full bg-[#0B192C] text-white flex items-center justify-center shadow-xl"><HiCheckBadge className="w-7 h-7" /></div>
          </div>
        </div>
        <div data-aos="fade-left">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-10 h-10 rounded-full bg-[#0077c8] text-white flex items-center justify-center font-black">360°</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0077c8] leading-tight">{language === "EN" ? "Our Investigation, Drilling & Installation Approach" : "Pendekatan Investigasi, Pengeboran, Instalasi Kami"}</h2>
          </div>
          <p className="text-gray-600 mb-4">{about.processDesc[language]}</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white border shadow-sm"><div className="text-sm font-bold text-[#0B192C]">{about.dataDrivenTitle[language]}</div><div className="text-xs text-gray-500 mt-1">{about.dataDrivenDesc[language]}</div></div>
            <div className="p-4 rounded-2xl bg-white border shadow-sm"><div className="text-sm font-bold text-[#0B192C]">{about.permitTitle[language]}</div><div className="text-xs text-gray-500 mt-1">{about.permitDesc[language]}</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
