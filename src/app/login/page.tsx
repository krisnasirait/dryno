"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HiLockClosed,
  HiEye,
  HiEyeSlash,
  HiArrowRight,
  HiShieldCheck,
  HiExclamationCircle,
  HiArrowLeft,
} from "react-icons/hi2";
import { FaGithub } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password.trim()) {
      setError("Masukkan password admin terlebih dahulu.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Password salah atau autentikasi gagal.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Gagal menghubungi server. Periksa koneksi jaringan Anda.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060E1A] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#005B94]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#00A3FF]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navigation Back to Website */}
      <div className="w-full max-w-md mb-6 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <HiArrowLeft aria-hidden="true" className="w-4 h-4" />
          <span>Kembali ke Halaman Utama Website</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#0B192C]/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#005B94] to-[#00A3FF] flex items-center justify-center shadow-lg shadow-[#00A3FF]/20 mb-4">
            <HiShieldCheck aria-hidden="true" className="w-8 h-8 text-white" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] font-bold tracking-wider uppercase text-[#00A3FF] mb-3">
            <FaGithub aria-hidden="true" className="w-3.5 h-3.5" />
            <span>GitHub-Powered Headless CMS</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            DRYNO Admin Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
            Masukkan password administrator untuk mengelola konten website secara langsung ke repository GitHub.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-3">
            <HiExclamationCircle aria-hidden="true" className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2"
            >
              Admin Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <HiLockClosed aria-hidden="true" className="w-5 h-5" />
              </div>
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password admin..."
                autoFocus
                required
                className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#00A3FF] focus:ring-2 focus:ring-[#00A3FF]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <HiEyeSlash aria-hidden="true" className="w-5 h-5" />
                ) : (
                  <HiEye aria-hidden="true" className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#005B94] to-[#00A3FF] hover:from-[#004875] hover:to-[#0088d6] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#005B94]/30 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Memverifikasi Sesi...</span>
              </>
            ) : (
              <>
                <span>Masuk ke Dashboard CMS</span>
                <HiArrowRight aria-hidden="true" className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Info */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>HTTP-Only Cookie Session</span>
          <span>GitHub Contents API v2022-11-28</span>
        </div>
      </div>
    </div>
  );
}

