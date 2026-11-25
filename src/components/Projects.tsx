"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  HiChevronLeft,
  HiChevronRight,
  HiArrowRight,
  HiXMark,
  HiPhoto,
  HiVideoCamera,
  HiPlay,
  HiMagnifyingGlassPlus,
} from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/context/translations";
import type { ProjectItem, ProjectMediaItem } from "@/types/cms";

export default function Projects() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null
  );
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const ticking = useRef(false);
  const handleScroll = () => {
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      ticking.current = false;
      const el = scrollContainerRef.current;
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      const v = max > 0 ? el.scrollLeft / max : 0;
      setScrollProgress((prev) => (Math.abs(prev - v) > 0.002 ? v : prev));
    });
  };
  const { language, content } = useLanguage();
  const t = translations[language].projects;

  const projects: ProjectItem[] = content.projects || [];
  const mediaTitle = (m: { title: string; titleEN?: string }) =>
    language === "EN" ? m.titleEN || m.title : m.title;
  const mediaDesc = (m: { description?: string; descriptionEN?: string }) =>
    language === "EN" ? m.descriptionEN || m.description : m.description;
  const whatsappNumber = content.contact?.whatsappNumber || "6285792096854";

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -380 : 380;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const openGallery = (project: ProjectItem, imageIndex: number = 0) => {
    setSelectedProject(project);
    setCurrentImageIndex(imageIndex);
  };

  const closeGallery = useCallback(() => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
  }, []);

  const handlePrevImage = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (!selectedProject || !selectedProject.gallery?.length) return;
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedProject.gallery.length - 1 : prev - 1
      );
    },
    [selectedProject]
  );

  const handleNextImage = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (!selectedProject || !selectedProject.gallery?.length) return;
      setCurrentImageIndex((prev) =>
        prev === selectedProject.gallery.length - 1 ? 0 : prev + 1
      );
    },
    [selectedProject]
  );

  const handlePrevProject = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedProject || projects.length === 0) return;
    const currentIndex = projects.findIndex((p) => p.id === selectedProject.id);
    const prevProject =
      currentIndex <= 0
        ? projects[projects.length - 1]
        : projects[currentIndex - 1];
    setSelectedProject(prevProject);
    setCurrentImageIndex(0);
  };

  const handleNextProject = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedProject || projects.length === 0) return;
    const currentIndex = projects.findIndex((p) => p.id === selectedProject.id);
    const nextProject =
      currentIndex >= projects.length - 1
        ? projects[0]
        : projects[currentIndex + 1];
    setSelectedProject(nextProject);
    setCurrentImageIndex(0);
  };

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!selectedProject) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeGallery();
      } else if (e.key === "ArrowLeft") {
        handlePrevImage();
      } else if (e.key === "ArrowRight") {
        handleNextImage();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProject, closeGallery, handlePrevImage, handleNextImage]);

  const currentMedia: ProjectMediaItem | undefined =
    selectedProject?.gallery?.[currentImageIndex] ||
    (selectedProject
      ? {
          type: "image",
          src: selectedProject.image,
          title: selectedProject.title,
          description: selectedProject.scope,
        }
      : undefined);

  return (
    <section
      id="projects"
      className="relative py-8 sm:py-16 lg:py-24 bg-white text-deep-navy overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Slider Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-10 pb-3 sm:pb-6 border-b border-gray-100 gap-3 sm:gap-4">
          {/* Title Area */}
          <div>
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-gray-500 uppercase block mb-1 sm:mb-2">
              {t.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-deep-navy tracking-tight">
              {t.title}
            </h2>
          </div>

          {/* Controls & Action Link */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Slider Navigation Arrows */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => scroll("left")}
                aria-label="Previous project"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 text-gray-600 hover:bg-deep-navy hover:text-white hover:border-deep-navy flex items-center justify-center transition-all duration-300 active:scale-95"
              >
                <HiChevronLeft aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                aria-label="Next project"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 text-gray-600 hover:bg-deep-navy hover:text-white hover:border-deep-navy flex items-center justify-center transition-all duration-300 active:scale-95"
              >
                <HiChevronRight aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* View All Projects Link */}
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-gray-500 hover:text-engineering-blue tracking-widest uppercase transition-colors"
            >
              <span>{t.viewAll}</span>
              <HiArrowRight aria-hidden="true" className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </a>
          </div>
        </div>

        <div className="mt-4 h-1 rounded-full bg-gray-100 overflow-hidden" role="progressbar" aria-label="Projects scroll progress" aria-valuenow={Math.round(scrollProgress * 100)} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full w-full origin-left bg-engineering-blue rounded-full" style={{ transform: `scaleX(${Math.max(0.08, scrollProgress)})` }} />
        </div>

        {/* Slidable Cards Row / Responsive Grid */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto gap-3 sm:gap-6 pb-2.5 sm:pb-4 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((project) => {
            const galleryList = project.gallery || [];

            return (
              <div
                key={project.id}
                onClick={() => openGallery(project, 0)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openGallery(project, 0);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`${t.openGalleryText}: ${project.title}`}
                className="min-w-[270px] sm:min-w-[360px] lg:min-w-[380px] flex-1 snap-start group rounded-2xl bg-warm-white border border-gray-100/80 shadow-sm hover:shadow-lg hover:border-engineering-blue/40 transition-shadow duration-300 flex flex-col justify-between overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-engineering-blue"
              >
                {/* Project Image with Photo & Video Badges + Hover Overlay */}
                <div className="relative h-40 sm:h-52 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={project.image || "/images/project/maison.png"}
                    alt={project.title}
                    fill
                    unoptimized={
                      project.image?.startsWith("http") ||
                      project.image?.startsWith("/images/uploads/")
                    }
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading="lazy" decoding="async" className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Date Badge */}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-deep-navy/80 backdrop-blur-sm text-[10px] font-bold text-white tracking-wider z-10">
                    {project.date}
                  </div>

                  {/* Hover Overlay (single layer) */}
                  <div className="absolute inset-0 bg-deep-navy/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10" aria-hidden>
                    <span className="px-3.5 py-1.5 rounded-full bg-white/95 text-deep-navy text-xs font-bold shadow-lg flex items-center gap-1.5">
                      <HiMagnifyingGlassPlus aria-hidden="true" className="w-4 h-4 text-engineering-blue" />
                      {t.openGalleryText}
                    </span>
                  </div>
                </div>

                {/* Card Main Info */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-lg font-extrabold text-deep-navy leading-snug mb-1">
                      {project.title}
                    </h3>
                    <p className="text-xs font-medium text-gray-500 mb-3">
                      {project.location} &nbsp;|&nbsp;{" "}
                      <span className="text-gray-500">{project.date}</span>
                    </p>
                    <span className="inline-block px-2.5 py-1 rounded-md bg-engineering-blue/10 text-engineering-blue text-[11px] font-semibold mb-4">
                      {project.scope}
                    </span>
                  </div>

                  {/* 3 Metric Columns */}
                  <div>
                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200/60 text-center">
                      {/* Metric 1 */}
                      <div className="border-r border-gray-200/60 pr-1">
                        <span className="text-lg sm:text-xl font-extrabold text-deep-navy block leading-none mb-1 tabular-nums">
                          {project.finalDepth}
                        </span>
                        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                          {t.finalDepthLabel}
                        </span>
                      </div>

                      {/* Metric 2 */}
                      <div className="border-r border-gray-200/60 px-1">
                        <span className="text-lg sm:text-xl font-extrabold text-deep-navy block leading-none mb-1 tabular-nums">
                          {project.waterEncounter}
                        </span>
                        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                          {t.waterEncounterLabel}
                        </span>
                      </div>

                      {/* Metric 3 */}
                      <div className="pl-1">
                        <span className="text-lg sm:text-xl font-extrabold text-deep-navy block leading-none mb-1 tabular-nums">
                          {project.waterDischarge}
                        </span>
                        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                          {t.dischargeLabel}
                        </span>
                      </div>
                    </div>

                    {/* View Documentation Link Bar */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-engineering-blue">
                      <span className="flex items-center gap-1.5">
                        <HiPhoto aria-hidden="true" className="w-4 h-4" />
                        {t.openGalleryText} ({galleryList.length} Media)
                      </span>
                      <span aria-hidden>→</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Gallery & Video Modal */}
      {selectedProject && currentMedia && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 lg:p-6"
          onClick={closeGallery}
        >
          <div
            className="relative w-full max-w-4xl lg:max-w-5xl bg-deep-navy border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-deep-navy-dark/70">
              <div className="pr-4">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] font-bold tracking-widest text-engineering-blue-light uppercase bg-engineering-blue/20 px-2 py-0.5 rounded border border-engineering-blue/30">
                    {t.eyebrow}
                  </span>
                  <span className="text-xs text-gray-500 hidden sm:inline">
                    •
                  </span>
                  <span className="text-xs text-gray-300 font-medium">
                    {selectedProject.location}
                  </span>
                  <span className="text-xs text-gray-500 hidden sm:inline">
                    •
                  </span>
                  <span className="text-xs text-gray-500">
                    {selectedProject.date}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-bold text-white tracking-tight">
                  {selectedProject.title}
                </h3>
              </div>

              {/* Close Button */}
              <button
                autoFocus
                onClick={closeGallery}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors flex-shrink-0"
                aria-label={`${t.closeModal} (Esc)`}
                title={`${t.closeModal} (Esc)`}
              >
                <HiXMark aria-hidden="true" className="w-6 h-6" />
              </button>
            </div>

            {/* Main Media Display Area */}
            <div className="relative w-full h-[42vh] sm:h-[50vh] md:h-[54vh] bg-black/80 flex items-center justify-center select-none overflow-hidden">
              {currentMedia.type === "video" ? (
                <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-3 bg-black">
                  <video
                    key={currentMedia.src}
                    src={currentMedia.src}
                    poster={currentMedia.poster}
                    controls
                    playsInline
                    autoPlay
                    className="max-h-[38vh] sm:max-h-[46vh] md:max-h-[50vh] w-auto max-w-full rounded-xl shadow-2xl bg-black object-contain focus:outline-none"
                  >
                    {language === "ID"
                      ? "Browser Anda tidak mendukung pemutaran video tag."
                      : "Your browser does not support the video tag."}
                  </video>
                </div>
              ) : (
                <Image
                  key={currentMedia.src}
                  src={currentMedia.src}
                  alt={mediaTitle(currentMedia)}
                  fill
                  priority
                  unoptimized={
                    currentMedia.src?.startsWith("http") ||
                    currentMedia.src?.startsWith("/images/uploads/")
                  }
                  sizes="(max-width: 1024px) 100vw, 1100px"
                  className="object-contain"
                />
              )}

              {/* Media Type & Counter Badge */}
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs font-semibold text-white tracking-wider border border-white/10 z-20 flex items-center gap-1.5">
                {currentMedia.type === "video" ? (
                  <span className="flex items-center gap-1 text-red-400 font-bold">
                    <HiVideoCamera aria-hidden="true" className="w-3.5 h-3.5" />
                    {t.videoCount}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-engineering-blue-light font-bold">
                    <HiPhoto aria-hidden="true" className="w-3.5 h-3.5" />
                    {t.photosCount}
                  </span>
                )}
                <span className="text-white/80">
                  {currentImageIndex + 1} /{" "}
                  {Math.max(1, selectedProject.gallery?.length || 1)}
                </span>
              </div>

              {/* Navigation Arrows */}
              {selectedProject.gallery?.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    aria-label={
                      language === "ID" ? "Media sebelumnya" : "Previous media"
                    }
                    className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/15 flex items-center justify-center transition-all duration-200 active:scale-95 backdrop-blur-sm z-20"
                  >
                    <HiChevronLeft aria-hidden="true" className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    aria-label={
                      language === "ID" ? "Media selanjutnya" : "Next media"
                    }
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/15 flex items-center justify-center transition-all duration-200 active:scale-95 backdrop-blur-sm z-20"
                  >
                    <HiChevronRight aria-hidden="true" className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Media Caption & Description Bar */}
            <div className="px-4 py-2.5 sm:px-6 bg-deep-navy-dark/90 border-t border-white/10 flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                {currentMedia.type === "video" ? (
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <HiVideoCamera aria-hidden="true" className="w-3 h-3" />
                    {language === "ID" ? "Video Lapangan" : "Field Video"}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-engineering-blue/20 text-engineering-blue-light border border-engineering-blue/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <HiPhoto aria-hidden="true" className="w-3 h-3" />
                    {language === "ID" ? "Foto Dokumentasi" : "Site Photo"}
                  </span>
                )}
                <h4 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-1">
                  {mediaTitle(currentMedia)}
                </h4>
              </div>
              {mediaDesc(currentMedia) && (
                <p className="text-xs text-gray-300 line-clamp-1 sm:line-clamp-2 pl-0.5">
                  {mediaDesc(currentMedia)}
                </p>
              )}
            </div>

            {/* Modal Bottom: Thumbnails & Specs Bar */}
            <div className="p-3 sm:p-5 bg-deep-navy border-t border-white/10 flex flex-col gap-3">
              {/* Thumbnails Row */}
              {selectedProject.gallery?.length > 0 && (
                <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 [scrollbar-width:thin]">
                  {selectedProject.gallery.map((media, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      aria-label={`Media ${idx + 1}: ${mediaTitle(media)}`}
                      className={`relative flex-shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden transition-all duration-200 ${
                        currentImageIndex === idx
                          ? "ring-2 ring-engineering-blue-light ring-offset-2 ring-offset-deep-navy opacity-100 scale-105"
                          : "opacity-50 hover:opacity-85"
                      }`}
                    >
                      <Image
                        src={media.poster || media.src}
                        alt={mediaTitle(media)}
                        fill
                        unoptimized={
                          (media.poster || media.src)?.startsWith("http") ||
                          (media.poster || media.src)?.startsWith(
                            "/images/uploads/"
                          )
                        }
                        sizes="80px"
                        className="object-cover"
                      />
                      {media.type === "video" && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-md">
                            <HiPlay aria-hidden="true" className="w-3.5 h-3.5 translate-x-0.5" />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Project Specs & Switchers */}
              <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Specs */}
                <div className="flex items-center gap-4 sm:gap-6 text-gray-300">
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-medium">
                      {t.finalDepthLabel}
                    </span>
                    <span className="font-bold text-white">
                      {selectedProject.finalDepth}
                    </span>
                  </div>
                  <div className="w-px h-6 bg-white/10" />
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-medium">
                      {t.waterEncounterLabel}
                    </span>
                    <span className="font-bold text-white">
                      {selectedProject.waterEncounter}
                    </span>
                  </div>
                  <div className="w-px h-6 bg-white/10" />
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-medium">
                      {t.dischargeLabel}
                    </span>
                    <span className="font-bold text-white">
                      {selectedProject.waterDischarge}
                    </span>
                  </div>
                </div>

                {/* Project Switchers & WhatsApp Consultation CTA */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handlePrevProject}
                    className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors text-xs font-medium flex items-center gap-1"
                  >
                    <HiChevronLeft aria-hidden="true" className="w-3.5 h-3.5" />
                    <span>
                      {language === "ID"
                        ? "Proyek Sebelumnya"
                        : "Previous Project"}
                    </span>
                  </button>
                  <button
                    onClick={handleNextProject}
                    className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors text-xs font-medium flex items-center gap-1"
                  >
                    <span>
                      {language === "ID"
                        ? "Proyek Selanjutnya"
                        : "Next Project"}
                    </span>
                    <HiChevronRight aria-hidden="true" className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      language === "ID"
                        ? `Halo DRYNO, saya tertarik dengan proyek ${selectedProject.title} (${selectedProject.location}). Bisa konsultasi untuk kebutuhan sumur bor kami?`
                        : `Hello DRYNO, I am interested in the ${selectedProject.title} (${selectedProject.location}) project. Can we consult regarding our deep well requirements?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white transition-all text-xs font-bold flex items-center gap-1.5 shadow-sm ml-1"
                  >
                    <FaWhatsapp aria-hidden="true" className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {language === "ID"
                        ? "Tanya Proyek Ini"
                        : "Inquire Project"}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
