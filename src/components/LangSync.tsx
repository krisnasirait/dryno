"use client";
import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

/** Keeps <html lang> in sync with the EN/ID toggle for crawlers + screen readers. */
export default function LangSync() {
  const { language } = useLanguage();
  useEffect(() => {
    document.documentElement.lang = language === "ID" ? "id" : "en";
  }, [language]);
  return null;
}
