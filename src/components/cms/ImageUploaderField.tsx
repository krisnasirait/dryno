"use client";

import React, { useRef, useState } from "react";
import {
  HiCloudArrowUp,
  HiLink,
  HiPhoto,
  HiCheckCircle,
  HiExclamationTriangle,
  HiTrash,
} from "react-icons/hi2";

interface ImageUploaderFieldProps {
  label: string;
  value: string;
  onChange: (newUrl: string) => void;
  helperText?: string;
  onNotify?: (type: "success" | "error", message: string) => void;
}

const MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1 MB strict limit

export default function ImageUploaderField({
  label,
  value,
  onChange,
  helperText,
  onNotify,
}: ImageUploaderFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [uploadSuccessInfo, setUploadSuccessInfo] = useState<string | null>(
    null
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalError(null);
    setUploadSuccessInfo(null);

    // Client-side strict validation: Max 1 MB
    if (file.size > MAX_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const errMsg = `Ukuran file (${sizeMB} MB) melebihi batas maksimum 1 MB! Silakan pilih gambar di bawah 1 MB.`;
      setLocalError(errMsg);
      onNotify?.("error", errMsg);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      const errMsg = "File yang dipilih harus berupa gambar (JPG, PNG, WEBP, GIF, SVG).";
      setLocalError(errMsg);
      onNotify?.("error", errMsg);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/cms/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg = data?.error || "Gagal mengunggah gambar ke GitHub.";
        setLocalError(errMsg);
        onNotify?.("error", errMsg);
        return;
      }

      // Automatically populate the field with the committed GitHub image URL path
      onChange(data.url);
      setUploadSuccessInfo(`Committed ke GitHub: ${data.repoPath}`);
      onNotify?.(
        "success",
        `Gambar berhasil di-commit ke GitHub (${data.url})`
      );
    } catch {
      const errMsg = "Terjadi kesalahan jaringan saat mengunggah gambar ke GitHub.";
      setLocalError(errMsg);
      onNotify?.("error", errMsg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2.5 bg-slate-900/70 border border-slate-800 rounded-2xl p-4">
      {/* Top Row: Label & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <HiPhoto aria-hidden="true" className="w-4 h-4 text-[#00A3FF]" />
          <span>{label}</span>
        </label>

        <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode("url");
              setLocalError(null);
            }}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all cursor-pointer ${
              mode === "url"
                ? "bg-[#005B94] text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <HiLink aria-hidden="true" className="w-3.5 h-3.5" />
            <span>Input URL</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("upload");
              setLocalError(null);
            }}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all cursor-pointer ${
              mode === "upload"
                ? "bg-[#005B94] text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <HiCloudArrowUp aria-hidden="true" className="w-3.5 h-3.5" />
            <span>Upload ke GitHub (Maks 1MB)</span>
          </button>
        </div>
      </div>

      {/* Content Area: Preview + Input/Upload */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Thumbnail Preview */}
        <div className="relative w-full sm:w-28 h-24 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0 flex items-center justify-center">
          {value ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt={label}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <button
                type="button"
                onClick={() => onChange("")}
                title="Hapus URL gambar"
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
              >
                <HiTrash aria-hidden="true" className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="text-center p-2 text-slate-600">
              <HiPhoto aria-hidden="true" className="w-6 h-6 mx-auto mb-1" />
              <span className="text-[10px] block">No Image</span>
            </div>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex-1 w-full space-y-2">
          {mode === "url" ? (
            <div>
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="/images/nama-file.jpg atau https://..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-[#00A3FF] transition-colors font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                {helperText ||
                  "Masukkan path relatif (misal /images/service-1.jpg) atau URL gambar eksternal (https://...)."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
                onChange={handleFileSelect}
                disabled={uploading}
                className="hidden"
              />
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#005B94] to-[#00A3FF] hover:from-[#004875] hover:to-[#0088d6] text-white text-xs font-bold tracking-wide flex items-center gap-2 shadow-md transition-all disabled:opacity-60 cursor-pointer"
                >
                  {uploading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Mengunggah & Commit ke GitHub...</span>
                    </>
                  ) : (
                    <>
                      <HiCloudArrowUp aria-hidden="true" className="w-4 h-4" />
                      <span>Pilih File Gambar (Maks 1 MB)</span>
                    </>
                  )}
                </button>

                {value && (
                  <span className="text-[11px] font-mono text-slate-400 truncate max-w-xs">
                    Path: {value}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                File otomatis di-commit via GitHub API base64 ke{" "}
                <code className="text-[#00A3FF]">public/images/uploads/</code>{" "}
                tanpa menyentuh filesystem lokal.
              </p>
            </div>
          )}

          {/* Feedback Banners */}
          {localError && (
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <HiExclamationTriangle aria-hidden="true" className="w-4 h-4 text-red-400 shrink-0" />
              <span>{localError}</span>
            </div>
          )}

          {uploadSuccessInfo && !localError && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <HiCheckCircle aria-hidden="true" className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{uploadSuccessInfo}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

