"use client";

import Link from "next/link";
import React, { useState, useMemo } from "react";
import {
  HiCalculator,
  HiTruck,
  HiCalendarDays,
  HiInformationCircle,
  HiExclamationTriangle,
  HiArrowRight,
  HiSparkles,
} from "react-icons/hi2";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/context/translations";

export default function WaterTankerCalculator() {
  const { language, content } = useLanguage();
  const t = translations[language].calculator;

  const phoneNumber = content.contact?.whatsappNumber || "6285792096854";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    language === "ID"
      ? "Halo DRYNO, saya tertarik membuat sumur dalam mandiri untuk properti saya. Mohon bantuannya untuk konsultasi."
      : "Hello DRYNO, I'm interested in an independent deep well for my property. I'd like to consult with your engineers."
  )}`;

  // Inputs
  const [dailyNeed, setDailyNeed] = useState<number>(1000);
  const [tankCapacity] = useState<number>(5000);
  const [pricePerTank] = useState<number>(250000);
  const [projectionYears, setProjectionYears] = useState<5 | 10 | 25>(10);

  // Calculations
  const calculations = useMemo(() => {
    const monthlyVolume = dailyNeed * 30;
    const tanksPerMonth = monthlyVolume / tankCapacity;
    const monthlyCost = tanksPerMonth * pricePerTank;
    const yearlyCost = monthlyCost * 12;
    const projectedCost = yearlyCost * projectionYears;

    const cost5Years = yearlyCost * 5;
    const cost10Years = yearlyCost * 10;
    const cost25Years = yearlyCost * 25;

    return {
      monthlyVolume,
      tanksPerMonth,
      monthlyCost,
      yearlyCost,
      projectedCost,
      cost5Years,
      cost10Years,
      cost25Years,
    };
  }, [dailyNeed, tankCapacity, pricePerTank, projectionYears]);

  // Deterministic Currency Formatter (IDR) to guarantee 100% server-client match
  const formatIDR = (value: number) => {
    return `IDR ${Math.round(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  // Deterministic Number Formatter
  const formatNumber = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const presetValues = [1000, 3000, 5000, 10000];
  const presets = t.presets.map((preset, idx) => ({
    ...preset,
    value: presetValues[idx],
  }));

  return (
    <section
      id="tanker-calculator"
      className="relative py-6 sm:py-16 lg:py-20 bg-warm-white text-deep-navy overflow-hidden"
    >

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-4xl mb-4 sm:mb-10 lg:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-engineering-blue/10 border border-engineering-blue/20 text-engineering-blue text-[11px] sm:text-xs font-bold tracking-wider uppercase mb-2 sm:mb-4">
            <HiCalculator aria-hidden="true" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-engineering-blue shrink-0" />
            <span>{t.badge}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-deep-navy leading-[1.15] tracking-tight mb-2 sm:mb-4">
            {t.title}
          </h1>

          <p className="text-xs sm:text-base lg:text-lg text-gray-700 leading-relaxed font-normal">
            {t.desc}
          </p>
        </div>

        {/* Main Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-start mb-6 sm:mb-12">
          {/* Controls Column (lg:col-span-6) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-4 sm:p-8 shadow-xl border border-gray-100/90 space-y-4 sm:space-y-7">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-deep-navy mb-1 flex items-center gap-2">
                <HiSparkles aria-hidden="true" className="w-5 h-5 text-engineering-blue" />
                <span>{t.simulationTitle}</span>
              </h2>
              <p className="text-xs text-gray-500">
                {t.simulationDesc}
              </p>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">
                {t.presetsLabel}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setDailyNeed(preset.value)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${dailyNeed === preset.value
                      ? "bg-deep-navy text-white border-deep-navy shadow-sm"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                  >
                    <div className="text-[11px] font-bold truncate">
                      {preset.label}
                    </div>
                    <div
                      className={`text-[10px] mt-0.5 ${dailyNeed === preset.value
                        ? "text-engineering-blue-light"
                        : "text-gray-500"
                        }`}
                    >
                      {formatNumber(preset.value)} {language === "ID" ? "L/hari" : "L/day"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Parameter 1: Daily Water Demand */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="calc-daily" className="text-xs font-bold uppercase tracking-wider text-gray-600">
                  {t.dailyDemandLabel}
                </label>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 border border-gray-200">
                  <input
                    id="calc-daily"
                    type="number"
                    min="100"
                    max="50000"
                    step="100"
                    value={dailyNeed}
                    onChange={(e) =>
                      setDailyNeed(Math.max(0, Number(e.target.value)))
                    }
                    className="w-20 bg-transparent text-right text-xs font-extrabold text-deep-navy focus:outline-none"
                  />
                  <span className="text-[11px] font-semibold text-gray-500">
                    {language === "ID" ? "L/hari" : "L/day"}
                  </span>
                </div>
              </div>

              {/* Slider */}
              <input
                id="calc-range"
                aria-label={t.dailyDemandLabel}
                type="range"
                min="500"
                max="20000"
                step="500"
                value={dailyNeed}
                onChange={(e) => setDailyNeed(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-engineering-blue"
              />
              <div className="flex justify-between text-[10px] font-medium text-gray-500">
                <span>{formatNumber(500)} {language === "ID" ? "L/hari" : "L/day"}</span>
                <span>{formatNumber(10000)} {language === "ID" ? "L/hari" : "L/day"}</span>
                <span>{formatNumber(20000)} {language === "ID" ? "L/hari" : "L/day"}</span>
              </div>
            </div>

            {/* Parameter 2: Tanker Capacity & Price per Tanker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              {/* Tank Capacity (Standard) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">
                  {language === "ID" ? "Kapasitas Tangki" : "Tanker Capacity"}
                </label>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700">
                  <span className="flex items-center gap-2 font-medium">
                    <HiTruck aria-hidden="true" className="w-4 h-4 text-engineering-blue" />
                    {language === "ID" ? "Truk Standar" : "Standard Truck"}
                  </span>
                  <span className="font-extrabold text-deep-navy">
                    {language === "ID" ? "5.000 Liter" : "5,000 Liters"}
                  </span>
                </div>
              </div>

              {/* Price per 5,000L Tanker */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block" htmlFor="calc-price">
                  {t.tankerPriceLabel}
                </label>
                <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-xs font-bold text-gray-500 pl-1">
                    IDR
                  </span>
                  <input
                    id="calc-price"
                    readOnly
                    type="text"
                    inputMode="numeric"
                    value={formatNumber(pricePerTank)}
                    aria-label={t.tankerPriceLabel}
                    className="w-full bg-transparent text-right text-xs font-extrabold text-gray-500 focus:outline-none pr-1"
                  />
                </div>
              </div>
            </div>

            {/* Parameter 3: Projection Horizon */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600 block">
                  {t.projectionLabel}
                </span>
              <div className="grid grid-cols-3 gap-2.5">
                {([5, 10, 25] as const).map((years) => (
                  <button
                    key={years}
                    type="button"
                    onClick={() => setProjectionYears(years)}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${projectionYears === years
                      ? "bg-engineering-blue text-white shadow-md shadow-engineering-blue/20"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    <HiCalendarDays aria-hidden="true" className="w-4 h-4" />
                    <span>{years} {language === "ID" ? "Tahun" : "Years"}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Dashboard Column (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            {/* Grand Total Highlight Banner */}
            <div className="rounded-3xl bg-gradient-to-br from-deep-navy via-deep-navy to-engineering-blue text-white p-4 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-engineering-blue-light/20 blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-engineering-blue-light px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/10 backdrop-blur-md">
                    {language === "ID"
                      ? `PROYEKSI BIAYA (${projectionYears} TAHUN)`
                      : `PROJECTED EXPENSE (${projectionYears} YEARS)`}
                  </span>
                  <span className="text-[11px] sm:text-xs font-medium text-gray-300">
                    {language === "ID" ? "Pembelian Air Tangki" : "Delivered Water Tankers"}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] sm:text-xs text-gray-300 font-light block mb-1">
                    {language === "ID"
                      ? `Akumulasi Pengeluaran Air Tangki (${projectionYears} Tahun)`
                      : `Cumulative Water Delivery Cost (${projectionYears} Years)`}
                  </span>
                  <div className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-none drop-shadow-md">
                    {formatIDR(calculations.projectedCost)}
                  </div>
                </div>

                {/* Multi-year Timeline Comparison */}
                <div className="pt-3 sm:pt-4 border-t border-white/15 space-y-1.5 sm:space-y-2">
                  <div className="text-[10px] sm:text-[11px] font-semibold text-gray-300 flex justify-between">
                    <span>
                      {language === "ID"
                        ? "Perbandingan Akumulasi Horizon:"
                        : "Cumulative Timeline Comparison:"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
                    <div
                      className={`p-2 rounded-xl transition-all ${projectionYears === 5
                        ? "bg-white/20 border border-white/30"
                        : "bg-white/5"
                        }`}
                    >
                      <div className="text-[10px] text-gray-300">
                        5 {language === "ID" ? "Tahun" : "Years"}
                      </div>
                      <div className="text-xs font-bold text-white mt-0.5">
                        {formatIDR(calculations.cost5Years)}
                      </div>
                    </div>

                    <div
                      className={`p-2 rounded-xl transition-all ${projectionYears === 10
                        ? "bg-white/20 border border-white/30"
                        : "bg-white/5"
                        }`}
                    >
                      <div className="text-[10px] text-gray-300">
                        10 {language === "ID" ? "Tahun" : "Years"}
                      </div>
                      <div className="text-xs font-bold text-white mt-0.5">
                        {formatIDR(calculations.cost10Years)}
                      </div>
                    </div>

                    <div
                      className={`p-2 rounded-xl transition-all ${projectionYears === 25
                        ? "bg-white/20 border border-white/30"
                        : "bg-white/5"
                        }`}
                    >
                      <div className="text-[10px] text-gray-300">
                        25 {language === "ID" ? "Tahun" : "Years"}
                      </div>
                      <div className="text-xs font-bold text-white mt-0.5">
                        {formatIDR(calculations.cost25Years)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Breakdown Cards */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
              {/* Metric 1: Monthly Demand */}
              <div className="p-3 sm:p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5 sm:mb-1">
                  {language === "ID" ? "Kebutuhan Bulanan" : "Monthly Demand"}
                </span>
                <div className="text-base sm:text-xl font-extrabold text-deep-navy">
                  {formatNumber(calculations.monthlyVolume)}{" "}
                  <span className="text-[11px] sm:text-xs font-medium text-gray-500">
                    {language === "ID" ? "Liter" : "Liters"}
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 mt-0.5 block">
                  {formatNumber(dailyNeed)} {language === "ID" ? "L/hari × 30 hari" : "L/day × 30 days"}
                </span>
              </div>

              {/* Metric 2: Equivalent Tankers */}
              <div className="p-3 sm:p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5 sm:mb-1">
                  {language === "ID" ? "Ritase Tangki" : "Equivalent Tankers"}
                </span>
                <div className="text-base sm:text-xl font-extrabold text-engineering-blue flex items-baseline gap-1">
                  <span>
                    {calculations.tanksPerMonth % 1 === 0
                      ? calculations.tanksPerMonth
                      : calculations.tanksPerMonth.toFixed(1)}
                  </span>
                  <span className="text-[11px] sm:text-xs font-medium text-gray-500">
                    {language === "ID" ? "tangki/bulan" : "trucks/month"}
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 mt-0.5 block">
                  {language === "ID" ? "5.000 L / armada" : "5,000 L / tanker"}
                </span>
              </div>

              {/* Metric 3: Monthly Cost */}
              <div className="p-3 sm:p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5 sm:mb-1">
                  {t.monthlyEst}
                </span>
                <div className="text-sm sm:text-lg font-extrabold text-deep-navy">
                  {formatIDR(calculations.monthlyCost)}
                </div>
                <span className="text-[10px] text-gray-500 mt-0.5 block">
                  {language === "ID" ? "Ritase × harga" : "Tankers × price"}
                </span>
              </div>

              {/* Metric 4: Annual Cost */}
              <div className="p-3 sm:p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5 sm:mb-1">
                  {t.yearlyEst}
                </span>
                <div className="text-sm sm:text-lg font-extrabold text-deep-navy">
                  {formatIDR(calculations.yearlyCost)}
                </div>
                <span className="text-[10px] text-gray-500 mt-0.5 block">
                  {language === "ID" ? "Bulanan × 12 bulan" : "Monthly × 12 months"}
                </span>
              </div>
            </div>

            {/* Direct CTA */}
            <div className="p-5 rounded-2xl bg-engineering-blue/5 border border-engineering-blue/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-deep-navy">
                  {t.ctaTitle}
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  {t.ctaDesc}
                </p>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-deep-navy hover:bg-engineering-blue text-white text-xs font-bold tracking-wider uppercase transition-colors shrink-0"
              >
                <span>{t.ctaButton}</span>
                <HiArrowRight aria-hidden="true" className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500">
              {language === "EN" ? "Compare with field proof:" : "Bandingkan dengan bukti lapangan:"}{" "}
              <Link href="/#projects" className="font-bold text-[#005B94] underline underline-offset-2 hover:text-[#0077c8]">220m Uluwatu →</Link>{" "}
              <span aria-hidden>•</span>{" "}
              <Link href="/#faq-faq-4" className="font-bold text-[#005B94] underline underline-offset-2 hover:text-[#0077c8]">{language === "EN" ? "SIPA FAQ" : "FAQ SIPA"} →</Link>
            </p>
          </div>
        </div>

        {/* Informational Notes & Disclaimers */}
        <div className="space-y-3.5">
          {/* Note 1: Baseline Simulation Parameters */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/80 text-xs text-gray-600 flex items-start gap-3">
            <HiInformationCircle aria-hidden="true" className="w-5 h-5 text-engineering-blue shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-deep-navy">
                {language === "ID" ? "Asumsi Parameter Simulasi Awal:" : "Initial Simulation Assumptions:"}
              </strong>{" "}
              {language === "ID"
                ? "Mengasumsikan konsumsi dasar 1.000 liter/hari, kapasitas tangki 5.000 liter, dan harga Rp250.000/tangki. Angka ini merupakan estimasi simulasi dan dapat bervariasi tergantung lokasi serta kondisi pasar aktual."
                : "Assumes a baseline consumption of 1,000 liters/day, 5,000 liters/tanker capacity, and IDR 250,000/tanker. This figure is an illustrative simulation parameter and may vary depending on actual location and market supply."}
            </p>
          </div>

          {/* Note 2: Calculator Disclaimers & Logistics */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/80 text-xs text-gray-600 flex items-start gap-3">
            <HiInformationCircle aria-hidden="true" className="w-5 h-5 text-engineering-blue shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-deep-navy">
                {language === "ID" ? "Catatan Kalkulator:" : "Calculator Note:"}
              </strong>{" "}
              {language === "ID"
                ? "Hasil perhitungan merupakan estimasi matematis berbasis konsumsi konstan tanpa memperhitungkan inflasi atau kenaikan harga saat musim kemarau. Untuk tagihan riil, pengiriman air selalu dibulatkan ke jumlah tangki penuh."
                : "Results are illustrative estimates based on constant consumption and uniform pricing, excluding inflation, surcharges for expedited dispatch or difficult terrain, and billing rounds up to whole truckloads."}
            </p>
          </div>

          {/* Note 3: Technical Objectivity Disclaimer */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3">
            <HiExclamationTriangle aria-hidden="true" className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-amber-950">
                {language === "ID" ? "Catatan objektivitas:" : "A note on objectivity:"}
              </strong>{" "}
              {language === "ID"
                ? "Kalkulator ini tidak dimaksudkan untuk mengklaim bahwa pembuatan sumur dalam selalu lebih ekonomis dalam setiap kondisi. Analisis kelayakan yang objektif wajib mempertimbangkan survei geolistrik, kedalaman bor, kualitas air tanah, biaya listrik pompa, perawatan rutin, perizinan SIPA, dan hasil debit riil di lapangan."
                : "This calculator does not automatically imply that deep well drilling is more economical in every scenario. A meaningful comparison against borehole capital investment requires factoring in hydrogeological investigation, drilling depths, casing specifications, pumping electricity, maintenance, water treatment/filtration if needed, SIPA regulatory permitting, and actual site-specific water table yield."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
