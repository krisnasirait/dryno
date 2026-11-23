"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HiArrowPath,
  HiCloudArrowUp,
  HiArrowRightOnRectangle,
  HiCheckCircle,
  HiExclamationTriangle,
  HiInformationCircle,
  HiPlus,
  HiPencilSquare,
  HiTrash,
  HiXMark,
  HiSparkles,
  HiPhoto,
  HiCube,
  HiDocumentText,
  HiBriefcase,
  HiWrenchScrewdriver,
  HiPhone,
  HiQuestionMarkCircle,
  HiArrowTopRightOnSquare,
  HiCodeBracket,
} from "react-icons/hi2";
import { FaGithub } from "react-icons/fa";
import ImageUploaderField from "@/components/cms/ImageUploaderField";
import type {
  CMSContent,
  ProductItem,
  ProjectItem,
  FaqItem,
} from "@/types/cms";

type ActiveTab =
  | "products"
  | "hero"
  | "about"
  | "projects"
  | "equipment"
  | "contact";

interface ToastMessage {
  id: number;
  type: "success" | "error" | "info";
  text: string;
  commitUrl?: string;
}

const emptyProduct: ProductItem = {
  id: "",
  number: "07",
  name: { EN: "", ID: "" },
  category: "Drilling",
  priceLabel: { EN: "Starting from", ID: "Mulai dari" },
  price: { EN: "IDR 15,000,000", ID: "IDR 15,000,000" },
  shortDesc: { EN: "", ID: "" },
  fullDesc: { EN: "", ID: "" },
  image: "/images/service-1.jpg",
  status: "Active",
  includesEN: [],
  includesID: [],
  casingTypes: [],
  note: { EN: "", ID: "" },
  disclaimer: { EN: "", ID: "" },
};

const emptyProject: ProjectItem = {
  id: "",
  title: "",
  location: "Uluwatu, Bali",
  date: "Mei 2026",
  scope: "Ground Water Investigation & Deep Well Drilling",
  finalDepth: "150 m",
  waterEncounter: "±130 m",
  waterDischarge: "6 m³/h",
  image: "/images/project/maison.png",
  status: "Completed",
  gallery: [],
};

export default function AdminCMSPage() {
  const router = useRouter();

  // CMS State
  const [content, setContent] = useState<CMSContent | null>(null);
  const [sha, setSha] = useState<string | null>(null);
  const [synced, setSynced] = useState<boolean>(false);
  const [syncSource, setSyncSource] = useState<string>("github");
  const [syncMessage, setSyncMessage] = useState<string>("");
  const [repoInfo, setRepoInfo] = useState<{
    owner: string;
    repo: string;
    branch: string;
    isConfigured: boolean;
  }>({
    owner: "AuxoaZ",
    repo: "lp-dryno",
    branch: "main",
    isConfigured: false,
  });

  // UI Feedback States
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [committing, setCommitting] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("products");
  const [editLang, setEditLang] = useState<"ID" | "EN">("ID");
  const [commitMessage, setCommitMessage] = useState<string>("");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Product CRUD Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [editingProductIndex, setEditingProductIndex] = useState<number | null>(
    null
  );
  const [productForm, setProductForm] = useState<ProductItem>(emptyProduct);
  const [productFormError, setProductFormError] = useState<string | null>(null);
  const [includesInputEN, setIncludesInputEN] = useState<string>("");
  const [includesInputID, setIncludesInputID] = useState<string>("");
  const [casingInput, setCasingInput] = useState<string>("");

  // Delete Confirmation Modal State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "product" | "project" | "faq" | "heroSlide";
    index: number;
    title: string;
  } | null>(null);

  // Project Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(
    null
  );
  const [projectForm, setProjectForm] = useState<ProjectItem>(emptyProject);

  // Toast Helper
  const addToast = useCallback(
    (
      type: "success" | "error" | "info",
      text: string,
      commitUrl?: string
    ) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, type, text, commitUrl }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 6000);
    },
    []
  );

  // Fetch Content from GitHub API
  const fetchLatestContent = useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        // Verify session first
        const sessionRes = await fetch("/api/auth/session", {
          cache: "no-store",
        });
        const sessionData = await sessionRes.json();
        if (!sessionData?.authenticated) {
          router.replace("/login");
          return;
        }

        const res = await fetch("/api/cms/content", { cache: "no-store" });
        const data = await res.json();

        if (!res.ok) {
          addToast(
            "error",
            data?.error || "Gagal mengambil data dari GitHub API."
          );
          return;
        }

        setContent(data.content);
        setSha(data.sha || null);
        setSynced(Boolean(data.synced));
        setSyncSource(data.source || "github");
        setSyncMessage(data.message || "");
        if (data.repoInfo) {
          setRepoInfo(data.repoInfo);
        }
        setHasUnsavedChanges(false);

        if (isManualRefresh) {
          addToast(
            "info",
            "Data berhasil disinkronisasi ulang dari GitHub Repository."
          );
        }
      } catch {
        addToast(
          "error",
          "Gagal menghubungi server saat melakukan sinkronisasi GitHub."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [addToast, router]
  );

  useEffect(() => {
    fetchLatestContent(false);
  }, [fetchLatestContent]);

  // Helper to update content & mark unsaved changes
  const updateContent = (updater: (prev: CMSContent) => CMSContent) => {
    setContent((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      return next;
    });
    setHasUnsavedChanges(true);
  };

  // Save / Publish to GitHub API
  const handlePublishToGitHub = async () => {
    if (!content) return;
    setCommitting(true);

    try {
      const res = await fetch("/api/cms/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          sha,
          commitMessage:
            commitMessage.trim() ||
            `chore(cms): update website content via Admin CMS`,
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        addToast("error", "Sesi Anda telah berakhir. Silakan login kembali.");
        router.push("/login");
        return;
      }

      if (!res.ok) {
        addToast(
          "error",
          data?.error || "Gagal melakukan commit ke GitHub Repository."
        );
        return;
      }

      setSha(data.sha);
      setContent(data.content);
      setSynced(true);
      setSyncSource("github");
      setHasUnsavedChanges(false);
      setCommitMessage("");
      addToast(
        "success",
        `Berhasil Commit & Publish ke GitHub! (SHA: ${data.sha?.slice(0, 7)})`,
        data.commitUrl
      );
    } catch {
      addToast("error", "Terjadi kesalahan jaringan saat mengirim commit ke GitHub.");
    } finally {
      setCommitting(false);
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  };

  // Product Modal Openers
  const openCreateProductModal = () => {
    const nextNum = String((content?.products.length || 0) + 1).padStart(
      2,
      "0"
    );
    setEditingProductIndex(null);
    setProductForm({
      ...emptyProduct,
      id: `service-${Date.now()}`,
      number: nextNum,
    });
    setIncludesInputEN("");
    setIncludesInputID("");
    setCasingInput("");
    setProductFormError(null);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (index: number) => {
    if (!content) return;
    const prod = content.products[index];
    setEditingProductIndex(index);
    setProductForm(JSON.parse(JSON.stringify(prod)));
    setIncludesInputEN((prod.includesEN || []).join("\n"));
    setIncludesInputID((prod.includesID || []).join("\n"));
    setCasingInput((prod.casingTypes || []).join(", "));
    setProductFormError(null);
    setIsProductModalOpen(true);
  };

  const handleSaveProductModal = (e: React.FormEvent) => {
    e.preventDefault();
    setProductFormError(null);

    if (!productForm.name.ID.trim() && !productForm.name.EN.trim()) {
      setProductFormError("Nama produk/layanan wajib diisi.");
      return;
    }
    if (!productForm.price.ID.trim() && !productForm.price.EN.trim()) {
      setProductFormError("Harga / label harga wajib diisi.");
      return;
    }
    if (!productForm.shortDesc.ID.trim() && !productForm.shortDesc.EN.trim()) {
      setProductFormError("Deskripsi singkat wajib diisi.");
      return;
    }

    const finalProduct: ProductItem = {
      ...productForm,
      id:
        productForm.id.trim() ||
        productForm.name.EN.toLowerCase().replace(/[^a-z0-9]+/g, "-") ||
        `prod-${Date.now()}`,
      name: {
        ID: productForm.name.ID.trim() || productForm.name.EN.trim(),
        EN: productForm.name.EN.trim() || productForm.name.ID.trim(),
      },
      price: {
        ID: productForm.price.ID.trim() || productForm.price.EN.trim(),
        EN: productForm.price.EN.trim() || productForm.price.ID.trim(),
      },
      priceLabel: {
        ID: productForm.priceLabel.ID.trim() || "Mulai dari",
        EN: productForm.priceLabel.EN.trim() || "Starting from",
      },
      shortDesc: {
        ID: productForm.shortDesc.ID.trim() || productForm.shortDesc.EN.trim(),
        EN: productForm.shortDesc.EN.trim() || productForm.shortDesc.ID.trim(),
      },
      fullDesc: {
        ID:
          productForm.fullDesc.ID.trim() ||
          productForm.shortDesc.ID.trim() ||
          productForm.fullDesc.EN.trim(),
        EN:
          productForm.fullDesc.EN.trim() ||
          productForm.shortDesc.EN.trim() ||
          productForm.fullDesc.ID.trim(),
      },
      includesEN: includesInputEN
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      includesID: includesInputID
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      casingTypes: casingInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    updateContent((prev) => {
      const updatedList = [...prev.products];
      if (editingProductIndex !== null) {
        updatedList[editingProductIndex] = finalProduct;
      } else {
        updatedList.push(finalProduct);
      }
      return { ...prev, products: updatedList };
    });

    setIsProductModalOpen(false);
    addToast(
      "info",
      editingProductIndex !== null
        ? `Produk "${finalProduct.name.ID}" diperbarui di draft. Klik Save / Publish untuk commit ke GitHub.`
        : `Produk "${finalProduct.name.ID}" ditambahkan ke draft. Klik Save / Publish untuk commit ke GitHub.`
    );
  };

  // Project Modal Openers
  const openCreateProjectModal = () => {
    setEditingProjectIndex(null);
    setProjectForm({
      ...emptyProject,
      id: `project-${Date.now()}`,
    });
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (index: number) => {
    if (!content) return;
    setEditingProjectIndex(index);
    setProjectForm(JSON.parse(JSON.stringify(content.projects[index])));
    setIsProjectModalOpen(true);
  };

  const handleSaveProjectModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title.trim()) return;

    const finalProject: ProjectItem = {
      ...projectForm,
      id:
        projectForm.id.trim() ||
        projectForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };

    updateContent((prev) => {
      const list = [...prev.projects];
      if (editingProjectIndex !== null) {
        list[editingProjectIndex] = finalProject;
      } else {
        list.push(finalProject);
      }
      return { ...prev, projects: list };
    });

    setIsProjectModalOpen(false);
    addToast(
      "info",
      `Proyek "${finalProject.title}" berhasil disimpan ke state draft.`
    );
  };

  // Handle Confirm Destructive Delete
  const handleConfirmDelete = () => {
    if (!deleteConfirm) return;
    const { type, index, title } = deleteConfirm;

    if (type === "product") {
      updateContent((prev) => ({
        ...prev,
        products: prev.products.filter((_, i) => i !== index),
      }));
    } else if (type === "project") {
      updateContent((prev) => ({
        ...prev,
        projects: prev.projects.filter((_, i) => i !== index),
      }));
    } else if (type === "faq") {
      updateContent((prev) => ({
        ...prev,
        faq: {
          ...prev.faq,
          items: prev.faq.items.filter((_, i) => i !== index),
        },
      }));
    } else if (type === "heroSlide") {
      updateContent((prev) => ({
        ...prev,
        hero: {
          ...prev.hero,
          images: prev.hero.images.filter((_, i) => i !== index),
        },
      }));
    }

    setDeleteConfirm(null);
    addToast(
      "info",
      `Item "${title}" telah dihapus dari daftar. Klik Save / Publish untuk meng-commit perubahan ke GitHub.`
    );
  };

  // Loading Skeleton
  if (loading || !content) {
    return (
      <div className="min-h-screen bg-[#060E1A] text-white p-6 sm:p-10">
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
          <div className="h-20 bg-slate-900 rounded-3xl border border-slate-800" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3 h-96 bg-slate-900 rounded-3xl border border-slate-800" />
            <div className="lg:col-span-9 h-[540px] bg-slate-900 rounded-3xl border border-slate-800 p-8 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-3 border-[#00A3FF]/30 border-t-[#00A3FF] rounded-full animate-spin" />
              <p className="text-sm font-semibold text-slate-300">
                Menyinkronkan data content.json langsung dari GitHub API...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs: {
    id: ActiveTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
  }[] = [
      {
        id: "products",
        label: "CRUD Produk & Layanan",
        icon: HiCube,
        badge: content.products.length,
      },
      { id: "hero", label: "Hero & Slider", icon: HiSparkles },
      { id: "about", label: "About & Banner", icon: HiDocumentText },
      {
        id: "projects",
        label: "Portofolio Proyek",
        icon: HiBriefcase,
        badge: content.projects.length,
      },
      {
        id: "equipment",
        label: "Equipment & Alat",
        icon: HiWrenchScrewdriver,
        badge: content.equipment.items.length,
      },
      {
        id: "contact",
        label: "Kontak, FAQ & Footer",
        icon: HiPhone,
      },
    ];

  return (
    <div className="min-h-screen bg-[#060E1A] text-slate-100 flex flex-col">
      {/* Toast Notifications Stack */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-start justify-between gap-3 transition-all ${toast.type === "success"
                ? "bg-emerald-950/95 border-emerald-500/40 text-emerald-200"
                : toast.type === "error"
                  ? "bg-red-950/95 border-red-500/40 text-red-200"
                  : "bg-slate-900/95 border-[#00A3FF]/40 text-slate-200"
              }`}
          >
            <div className="flex items-start gap-2.5 text-xs">
              {toast.type === "success" ? (
                <HiCheckCircle aria-hidden="true" className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : toast.type === "error" ? (
                <HiExclamationTriangle aria-hidden="true" className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              ) : (
                <HiInformationCircle aria-hidden="true" className="w-5 h-5 text-[#00A3FF] shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold leading-relaxed">{toast.text}</p>
                {toast.commitUrl && (
                  <a
                    href={toast.commitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-emerald-400 hover:underline"
                  >
                    <span>Lihat Commit di GitHub</span>
                    <HiArrowTopRightOnSquare aria-hidden="true" className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
            <button
              onClick={() =>
                setToasts((prev) => prev.filter((t) => t.id !== toast.id))
              }
              className="text-slate-400 hover:text-white"
            >
              <HiXMark aria-hidden="true" className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#0B192C]/90 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Left Brand & Repo Sync Status */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#005B94] to-[#00A3FF] flex items-center justify-center shadow-md">
              <FaGithub aria-hidden="true" className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                  DRYNO GitHub CMS
                </h1>

                {/* Sync Status Badge */}
                {synced ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    GitHub Synced
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    {repoInfo.isConfigured ? "Sync Warning" : "PAT Belum Diisi"}
                  </span>
                )}

                {hasUnsavedChanges && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-[11px] font-bold">
                    • Ada Perubahan Belum Di-Commit
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-0.5">
                <span>
                  {repoInfo.owner}/{repoInfo.repo} ({repoInfo.branch})
                </span>
                {sha && (
                  <>
                    <span>•</span>
                    <span className="text-[#00A3FF]">
                      SHA: {sha.slice(0, 7)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Controls: Language Toggle, Refresh, Save/Publish, Logout */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Editing Language Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setEditLang("ID")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${editLang === "ID"
                    ? "bg-[#005B94] text-white"
                    : "text-slate-400 hover:text-white"
                  }`}
              >
                Konten ID
              </button>
              <button
                type="button"
                onClick={() => setEditLang("EN")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${editLang === "EN"
                    ? "bg-[#005B94] text-white"
                    : "text-slate-400 hover:text-white"
                  }`}
              >
                Konten EN
              </button>
            </div>

            {/* Manual Refresh Button */}
            <button
              type="button"
              onClick={() => fetchLatestContent(true)}
              disabled={refreshing || committing}
              title="Fetch ulang content.json terbaru dari GitHub API"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
            >
              <HiArrowPath aria-hidden="true"
                className={`w-4 h-4 text-[#00A3FF] ${refreshing ? "animate-spin" : ""
                  }`}
              />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>

            {/* View Live Site */}
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <span>Lihat Web</span>
              <HiArrowTopRightOnSquare aria-hidden="true" className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            {/* Save / Publish Commit Button */}
            <button
              type="button"
              onClick={handlePublishToGitHub}
              disabled={committing}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#005B94] to-[#00A3FF] hover:from-[#004875] hover:to-[#0088d6] text-white text-xs font-extrabold tracking-wide uppercase flex items-center gap-2 shadow-lg shadow-[#00A3FF]/20 transition-all disabled:opacity-60 cursor-pointer"
            >
              {committing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Committing...</span>
                </>
              ) : (
                <>
                  <HiCloudArrowUp aria-hidden="true" className="w-4 h-4" />
                  <span>Save / Publish</span>
                </>
              )}
            </button>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              title="Logout dari Admin CMS"
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 transition-colors cursor-pointer"
            >
              <HiArrowRightOnRectangle aria-hidden="true" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        {/* GitHub Status / Warning Banner if PAT not configured */}
        {(!repoInfo.isConfigured || syncSource === "fallback") && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <HiExclamationTriangle aria-hidden="true" className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-100">
                  Perhatian Konfigurasi GitHub Environment (.env)
                </p>
                <p className="text-amber-300/90 mt-0.5 leading-relaxed">
                  {syncMessage ||
                    "Pastikan GITHUB_PAT (Classic PAT dengan permission repo), GITHUB_OWNER, GITHUB_REPO, dan GITHUB_BRANCH sudah diisi dengan benar di file .env agar fitur Commit/Publish dan Upload Gambar dapat menulis langsung ke repository GitHub."}
                </p>
              </div>
            </div>
            <div className="text-[11px] font-mono bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-500/20 shrink-0">
              Source: {syncSource.toUpperCase()}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sidebar Navigation (lg:col-span-3) */}
          <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-24">
            <div className="bg-[#0B192C] border border-slate-800/80 rounded-3xl p-3 space-y-1">
              <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                Modul Manajemen Konten
              </div>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full px-3.5 py-3 rounded-2xl text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${isActive
                        ? "bg-gradient-to-r from-[#005B94] to-[#005B94]/80 text-white shadow-md"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                      }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 ${isActive ? "text-[#00A3FF]" : "text-slate-500"
                          }`}
                      />
                      <span>{tab.label}</span>
                    </span>
                    {typeof tab.badge === "number" && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-800 text-slate-400"
                          }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Commit Panel Card in Sidebar */}
            <div className="bg-[#0B192C] border border-slate-800/80 rounded-3xl p-5 space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-white">
                <HiCodeBracket aria-hidden="true" className="w-4 h-4 text-[#00A3FF]" />
                <span>GitHub Commit Control</span>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Target File:</span>
                  <code className="text-slate-200 font-mono">content.json</code>
                </div>
                <div className="flex justify-between">
                  <span>Tracked SHA:</span>
                  <code className="text-[#00A3FF] font-mono">
                    {sha ? sha.slice(0, 10) : "New File"}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span>Terakhir Update:</span>
                  <span className="text-slate-300">
                    {new Date(content.updatedAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1.5">
                  Pesan Commit (Opsional)
                </label>
                <input
                  type="text"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="chore(cms): update data website"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00A3FF]"
                />
              </div>

              <button
                type="button"
                onClick={handlePublishToGitHub}
                disabled={committing}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#005B94] to-[#00A3FF] hover:from-[#004875] hover:to-[#0088d6] text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-60 cursor-pointer"
              >
                {committing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Mengirim Commit...</span>
                  </>
                ) : (
                  <>
                    <HiCloudArrowUp aria-hidden="true" className="w-4 h-4" />
                    <span>Save & Publish ke GitHub</span>
                  </>
                )}
              </button>
            </div>
          </aside>

          {/* Right Workspace Panel (lg:col-span-9) */}
          <main className="lg:col-span-9 space-y-6">
            {/* TAB 1: CRUD PRODUK & LAYANAN */}
            {activeTab === "products" && (
              <div className="space-y-6">
                {/* Section Header & Create Button */}
                <div className="bg-[#0B192C] border border-slate-800/80 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#00A3FF] block mb-1">
                      KATALOG PRODUK & LAYANAN
                    </span>
                    <h2 className="text-xl font-extrabold text-white">
                      Manajemen Produk / Layanan ({content.products.length}{" "}
                      Item)
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Kelola katalog layanan pengeboran, investigasi geolistrik,
                      dan perizinan beserta harga, foto, dan status tampil.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={openCreateProductModal}
                    className="px-4 py-3 rounded-2xl bg-[#00A3FF] hover:bg-[#0088d6] text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#00A3FF]/20 shrink-0 transition-all cursor-pointer"
                  >
                    <HiPlus aria-hidden="true" className="w-4 h-4 stroke-2" />
                    <span>Tambah Produk Baru</span>
                  </button>
                </div>

                {/* Product Cards / Table List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.products.map((product, idx) => (
                    <div
                      key={product.id || idx}
                      className="bg-[#0B192C] border border-slate-800/80 hover:border-slate-700 rounded-3xl overflow-hidden flex flex-col justify-between transition-all group"
                    >
                      <div>
                        {/* Card Top Image & Badges */}
                        <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.image || "/images/service-1.jpg"}
                            alt={product.name[editLang]}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-transparent to-black/40" />

                          {/* Number Badge */}
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md text-[11px] font-extrabold text-white border border-slate-700">
                            #{product.number} • {product.category}
                          </span>

                          {/* Status Badge */}
                          <span
                            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border ${product.status === "Featured"
                                ? "bg-[#00A3FF]/20 text-[#00A3FF] border-[#00A3FF]/40"
                                : product.status === "Active"
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                  : "bg-slate-700/60 text-slate-300 border-slate-600"
                              }`}
                          >
                            {product.status}
                          </span>
                        </div>

                        {/* Product Info */}
                        <div className="p-5 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-base font-extrabold text-white leading-snug">
                              {product.name[editLang]}
                            </h3>
                          </div>

                          <div className="flex items-baseline gap-1.5">
                            <span className="text-[11px] text-slate-400">
                              {product.priceLabel[editLang]}:
                            </span>
                            <span className="text-sm font-black text-[#00A3FF]">
                              {product.price[editLang]}
                            </span>
                          </div>

                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {product.shortDesc[editLang]}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="px-5 py-3.5 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono text-slate-500 truncate max-w-[180px]">
                          {product.image}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditProductModal(idx)}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-[#005B94] text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <HiPencilSquare aria-hidden="true" className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteConfirm({
                                type: "product",
                                index: idx,
                                title: product.name[editLang],
                              })
                            }
                            className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 transition-colors cursor-pointer"
                            title="Hapus Produk"
                          >
                            <HiTrash aria-hidden="true" className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Section Header Texts for Katalog Layanan */}
                <div className="bg-[#0B192C] border border-slate-800/80 rounded-3xl p-6 space-y-4">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
                    Pengaturan Header Section Layanan ({editLang})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">
                        Eyebrow Text ({editLang})
                      </label>
                      <input
                        type="text"
                        value={content.servicesMeta.eyebrow[editLang]}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            servicesMeta: {
                              ...prev.servicesMeta,
                              eyebrow: {
                                ...prev.servicesMeta.eyebrow,
                                [editLang]: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A3FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">
                        Judul Utama Section ({editLang})
                      </label>
                      <input
                        type="text"
                        value={content.servicesMeta.title[editLang]}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            servicesMeta: {
                              ...prev.servicesMeta,
                              title: {
                                ...prev.servicesMeta.title,
                                [editLang]: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A3FF]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">
                      Subtitle / Deskripsi Section ({editLang})
                    </label>
                    <textarea
                      rows={2}
                      value={content.servicesMeta.subtitle[editLang]}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          servicesMeta: {
                            ...prev.servicesMeta,
                            subtitle: {
                              ...prev.servicesMeta.subtitle,
                              [editLang]: e.target.value,
                            },
                          },
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A3FF]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: HERO & SLIDER */}
            {activeTab === "hero" && (
              <div className="space-y-6">
                <div className="bg-[#0B192C] border border-slate-800/80 rounded-3xl p-6 space-y-5">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#00A3FF] block mb-1">
                      HERO SECTION ({editLang})
                    </span>
                    <h2 className="text-xl font-extrabold text-white">
                      Manajemen Teks & CTA Hero Utama
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Tagline / Subtitle Atas ({editLang})
                      </label>
                      <input
                        type="text"
                        value={content.hero.tagline[editLang]}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            hero: {
                              ...prev.hero,
                              tagline: {
                                ...prev.hero.tagline,
                                [editLang]: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A3FF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Lokasi Operasional (Bottom Bar)
                      </label>
                      <input
                        type="text"
                        value={content.hero.location}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            hero: {
                              ...prev.hero,
                              location: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A3FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Hero Main Headline ({editLang})
                    </label>
                    <textarea
                      rows={2}
                      value={content.hero.headline[editLang]}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            headline: {
                              ...prev.hero.headline,
                              [editLang]: e.target.value,
                            },
                          },
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A3FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Hero Description ({editLang})
                    </label>
                    <textarea
                      rows={3}
                      value={content.hero.description[editLang]}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            description: {
                              ...prev.hero.description,
                              [editLang]: e.target.value,
                            },
                          },
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A3FF]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Tombol CTA Utama ({editLang})
                      </label>
                      <input
                        type="text"
                        value={content.hero.ctaDiscuss[editLang]}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            hero: {
                              ...prev.hero,
                              ctaDiscuss: {
                                ...prev.hero.ctaDiscuss,
                                [editLang]: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A3FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Tombol CTA Sekunder ({editLang})
                      </label>
                      <input
                        type="text"
                        value={content.hero.ctaServices[editLang]}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            hero: {
                              ...prev.hero,
                              ctaServices: {
                                ...prev.hero.ctaServices,
                                [editLang]: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A3FF]"
                      />
                    </div>
                  </div>
                </div>

                {/* Hero Background Slider Images */}
                <div className="bg-[#0B192C] border border-slate-800/80 rounded-3xl p-6 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#00A3FF] block mb-1">
                        HERO BACKGROUND SLIDER
                      </span>
                      <h3 className="text-lg font-extrabold text-white">
                        Daftar Gambar Background Hero (
                        {content.hero.images.length} Slide)
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        updateContent((prev) => {
                          const nextNum = String(
                            prev.hero.images.length + 1
                          ).padStart(2, "0");
                          return {
                            ...prev,
                            hero: {
                              ...prev.hero,
                              images: [
                                ...prev.hero.images,
                                {
                                  id: nextNum,
                                  src: "/images/bg-hero-1.jpeg",
                                  alt: `DRYNO Hero Slide ${nextNum}`,
                                },
                              ],
                            },
                          };
                        })
                      }
                      className="px-3.5 py-2 rounded-xl bg-[#005B94] hover:bg-[#00A3FF] text-white hover:text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <HiPlus aria-hidden="true" className="w-4 h-4" />
                      <span>Tambah Slide Hero</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {content.hero.images.map((slide, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-[#00A3FF]">
                            Slide #{slide.id || idx + 1}
                          </span>
                          {content.hero.images.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteConfirm({
                                  type: "heroSlide",
                                  index: idx,
                                  title: slide.alt || `Slide #${idx + 1}`,
                                })
                              }
                              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                            >
                              <HiTrash aria-hidden="true" className="w-3.5 h-3.5" />
                              <span>Hapus Slide</span>
                            </button>
                          )}
                        </div>

                        <ImageUploaderField
                          label={`Gambar Hero Slide #${idx + 1}`}
                          value={slide.src}
                          onNotify={addToast}
                          onChange={(newUrl) =>
                            updateContent((prev) => {
                              const nextImages = [...prev.hero.images];
                              nextImages[idx] = {
                                ...nextImages[idx],
                                src: newUrl,
                              };
                              return {
                                ...prev,
                                hero: { ...prev.hero, images: nextImages },
                              };
                            })
                          }
                        />

                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">
                            Alt Text / Keterangan Gambar
                          </label>
                          <input
                            type="text"
                            value={slide.alt}
                            onChange={(e) =>
                              updateContent((prev) => {
                                const nextImages = [...prev.hero.images];
                                nextImages[idx] = {
                                  ...nextImages[idx],
                                  alt: e.target.value,
                                };
                                return {
                                  ...prev,
                                  hero: { ...prev.hero, images: nextImages },
                                };
                              })
                            }
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-[#00A3FF]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ABOUT & WATER CHALLENGES BANNER */}
            {activeTab === "about" && (
              <div className="space-y-6">
                {/* About Section */}
                <div className="bg-[#0B192C] border border-slate-800/80 rounded-3xl p-6 space-y-5">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#00A3FF] block mb-1">
                      ABOUT SECTION ({editLang})
                    </span>
                    <h2 className="text-xl font-extrabold text-white">
                      Manajemen Konten About DRYNO
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Judul Baris 1 ({editLang})
                      </label>
                      <input
                        type="text"
                        value={content.about.titleLine1[editLang]}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            about: {
                              ...prev.about,
                              titleLine1: {
                                ...prev.about.titleLine1,
                                [editLang]: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A3FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Judul Baris 2 ({editLang})
                      </label>
                      <input
                        type="text"
                        value={content.about.titleLine2[editLang]}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            about: {
                              ...prev.about,
                              titleLine2: {
                                ...prev.about.titleLine2,
                                [editLang]: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A3FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Judul Baris 3 ({editLang})
                      </label>
                      <input
                        type="text"
                        value={content.about.titleLine3[editLang]}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            about: {
                              ...prev.about,
                              titleLine3: {
                                ...prev.about.titleLine3,
                                [editLang]: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A3FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Deskripsi Utama About ({editLang})
                    </label>
                    <textarea
                      rows={3}
                      value={content.about.description[editLang]}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          about: {
                            ...prev.about,
                            description: {
                              ...prev.about.description,
                              [editLang]: e.target.value,
                            },
                          },
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A3FF]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Angka Pengalaman (misal: 10+)
                      </label>
                      <input
                        type="text"
                        value={content.about.yearsExperience}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            about: {
                              ...prev.about,
                              yearsExperience: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A3FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Teks Overlay Banner About ({editLang})
                      </label>
                      <input
                        type="text"
                        value={content.about.bannerOverlayText[editLang]}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            about: {
                              ...prev.about,
                              bannerOverlayText: {
                                ...prev.about.bannerOverlayText,
                                [editLang]: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A3FF]"
                      />
                    </div>
                  </div>

                  <ImageUploaderField
                    label="Gambar Utama About Section"
                    value={content.about.image}
                    onNotify={addToast}
                    onChange={(newUrl) =>
                      updateContent((prev) => ({
                        ...prev,
                        about: { ...prev.about, image: newUrl },
                      }))
                    }
                  />
                </div>

                {/* Water Challenges Banner Section */}
                <div className="bg-[#0B192C] border border-slate-800/80 rounded-3xl p-6 space-y-5">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#00A3FF] block mb-1">
                      WATER CHALLENGES BANNER ({editLang})
                    </span>
                    <h2 className="text-xl font-extrabold text-white">
                      Manajemen Banner Tantangan Air & Referensi
                    </h2>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Badge Eyebrow ({editLang})
                    </label>
                    <input
                      type="text"
                      value={content.waterChallenges.eyebrow[editLang]}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          waterChallenges: {
                            ...prev.waterChallenges,
                            eyebrow: {
                              ...prev.waterChallenges.eyebrow,
                              [editLang]: e.target.value,
                            },
                          },
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A3FF]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Headline Bagian 1 ({editLang})
                      </label>
                      <input
                        type="text"
                        value={content.waterChallenges.headlinePart1[editLang]}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            waterChallenges: {
                              ...prev.waterChallenges,
                              headlinePart1: {
                                ...prev.waterChallenges.headlinePart1,
                                [editLang]: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A3FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Headline Bagian 2 - Highlight Biru ({editLang})
                      </label>
                      <input
                        type="text"
                        value={content.waterChallenges.headlinePart2[editLang]}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            waterChallenges: {
                              ...prev.waterChallenges,
                              headlinePart2: {
                                ...prev.waterChallenges.headlinePart2,
                                [editLang]: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A3FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Deskripsi Tantangan Air ({editLang})
                    </label>
                    <textarea
                      rows={3}
                      value={content.waterChallenges.description[editLang]}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          waterChallenges: {
                            ...prev.waterChallenges,
                            description: {
                              ...prev.waterChallenges.description,
                              [editLang]: e.target.value,
                            },
                          },
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A3FF]"
                    />
                  </div>

                  <ImageUploaderField
                    label="Gambar Banner Water Challenges"
                    value={content.waterChallenges.bannerImage}
                    onNotify={addToast}
                    onChange={(newUrl) =>
                      updateContent((prev) => ({
                        ...prev,
                        waterChallenges: {
                          ...prev.waterChallenges,
                          bannerImage: newUrl,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            )}

            {/* TAB 4: PORTOFOLIO PROYEK */}
            {activeTab === "projects" && (
              <div className="space-y-6">
                <div className="bg-[#0B192C] border border-slate-800/80 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#00A3FF] block mb-1">
                      FIELD PORTFOLIO
                    </span>
                    <h2 className="text-xl font-extrabold text-white">
                      Manajemen Proyek Lapangan ({content.projects.length}{" "}
                      Proyek)
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={openCreateProjectModal}
                    className="px-4 py-3 rounded-2xl bg-[#00A3FF] hover:bg-[#0088d6] text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shrink-0 transition-all cursor-pointer"
                  >
                    <HiPlus aria-hidden="true" className="w-4 h-4 stroke-2" />
                    <span>Tambah Proyek</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.projects.map((project, idx) => (
                    <div
                      key={project.id || idx}
                      className="bg-[#0B192C] border border-slate-800/80 rounded-3xl overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-44 bg-slate-950">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 text-white text-[11px] font-bold">
                            {project.date}
                          </span>
                        </div>
                        <div className="p-5 space-y-2">
                          <h3 className="text-base font-extrabold text-white">
                            {project.title}
                          </h3>
                          <p className="text-xs text-slate-400">
                            {project.location} • {project.scope}
                          </p>
                          <div className="grid grid-cols-3 gap-2 pt-2 text-center bg-slate-900/80 rounded-xl p-2.5 border border-slate-800">
                            <div>
                              <span className="text-xs font-extrabold text-white block">
                                {project.finalDepth}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                Kedalaman
                              </span>
                            </div>
                            <div>
                              <span className="text-xs font-extrabold text-white block">
                                {project.waterEncounter}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                Temuan Air
                              </span>
                            </div>
                            <div>
                              <span className="text-xs font-extrabold text-[#00A3FF] block">
                                {project.waterDischarge}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                Debit
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="px-5 py-3.5 bg-slate-900/60 border-t border-slate-800 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditProjectModal(idx)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-[#005B94] text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <HiPencilSquare aria-hidden="true" className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteConfirm({
                              type: "project",
                              index: idx,
                              title: project.title,
                            })
                          }
                          className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 transition-colors cursor-pointer"
                        >
                          <HiTrash aria-hidden="true" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: EQUIPMENT & ALAT */}
            {activeTab === "equipment" && (
              <div className="space-y-6">
                <div className="bg-[#0B192C] border border-slate-800/80 rounded-3xl p-6 space-y-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#00A3FF] block mb-1">
                      EQUIPMENT & CAPABILITY ({editLang})
                    </span>
                    <h2 className="text-xl font-extrabold text-white">
                      Manajemen Daftar Peralatan & Armada
                    </h2>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Deskripsi Section Peralatan ({editLang})
                    </label>
                    <textarea
                      rows={2}
                      value={content.equipment.desc[editLang]}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          equipment: {
                            ...prev.equipment,
                            desc: {
                              ...prev.equipment.desc,
                              [editLang]: e.target.value,
                            },
                          },
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A3FF]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {content.equipment.items.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-400 mb-1">
                              Nama Alat ({editLang})
                            </label>
                            <input
                              type="text"
                              value={item.title[editLang]}
                              onChange={(e) =>
                                updateContent((prev) => {
                                  const nextItems = [...prev.equipment.items];
                                  nextItems[idx] = {
                                    ...nextItems[idx],
                                    title: {
                                      ...nextItems[idx].title,
                                      [editLang]: e.target.value,
                                    },
                                  };
                                  return {
                                    ...prev,
                                    equipment: {
                                      ...prev.equipment,
                                      items: nextItems,
                                    },
                                  };
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-[#00A3FF]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-400 mb-1">
                              Spesifikasi ({editLang})
                            </label>
                            <input
                              type="text"
                              value={item.spec[editLang]}
                              onChange={(e) =>
                                updateContent((prev) => {
                                  const nextItems = [...prev.equipment.items];
                                  nextItems[idx] = {
                                    ...nextItems[idx],
                                    spec: {
                                      ...nextItems[idx].spec,
                                      [editLang]: e.target.value,
                                    },
                                  };
                                  return {
                                    ...prev,
                                    equipment: {
                                      ...prev.equipment,
                                      items: nextItems,
                                    },
                                  };
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-[#00A3FF]"
                            />
                          </div>
                        </div>

                        <ImageUploaderField
                          label={`Foto ${item.title[editLang]}`}
                          value={item.image}
                          onNotify={addToast}
                          onChange={(newUrl) =>
                            updateContent((prev) => {
                              const nextItems = [...prev.equipment.items];
                              nextItems[idx] = {
                                ...nextItems[idx],
                                image: newUrl,
                              };
                              return {
                                ...prev,
                                equipment: {
                                  ...prev.equipment,
                                  items: nextItems,
                                },
                              };
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: KONTAK, FAQ & FOOTER */}
            {activeTab === "contact" && (
              <div className="space-y-6">
                {/* Contact & Footer Info */}
                <div className="bg-[#0B192C] border border-slate-800/80 rounded-3xl p-6 space-y-5">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#00A3FF] block mb-1">
                      CONTACT & FOOTER ({editLang})
                    </span>
                    <h2 className="text-xl font-extrabold text-white">
                      Informasi Kontak, WhatsApp & Footer
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Judul Kontak ({editLang})
                      </label>
                      <input
                        type="text"
                        value={content.contact.title[editLang]}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            contact: {
                              ...prev.contact,
                              title: {
                                ...prev.contact.title,
                                [editLang]: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A3FF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Nomor WhatsApp Aktif (Format: 628xxx)
                      </label>
                      <input
                        type="text"
                        value={content.contact.whatsappNumber}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            contact: {
                              ...prev.contact,
                              whatsappNumber: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono focus:outline-none focus:border-[#00A3FF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Tampilan Nomor Telepon
                      </label>
                      <input
                        type="text"
                        value={content.contact.phoneDisplay}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            contact: {
                              ...prev.contact,
                              phoneDisplay: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A3FF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Alamat Email Resmi
                      </label>
                      <input
                        type="email"
                        value={content.contact.email}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            contact: {
                              ...prev.contact,
                              email: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A3FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Cakupan Wilayah Operasional
                    </label>
                    <input
                      type="text"
                      value={content.contact.coverage}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            coverage: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A3FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Deskripsi Brand di Footer ({editLang})
                    </label>
                    <textarea
                      rows={3}
                      value={content.contact.footerBrandDesc[editLang]}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            footerBrandDesc: {
                              ...prev.contact.footerBrandDesc,
                              [editLang]: e.target.value,
                            },
                          },
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A3FF]"
                    />
                  </div>
                </div>

                {/* FAQ Management */}
                <div className="bg-[#0B192C] border border-slate-800/80 rounded-3xl p-6 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#00A3FF] block mb-1">
                        FAQ MANAGEMENT ({editLang})
                      </span>
                      <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                        <HiQuestionMarkCircle aria-hidden="true" className="w-5 h-5 text-[#00A3FF]" />
                        <span>
                          Daftar Pertanyaan Umum ({content.faq.items.length}{" "}
                          FAQ)
                        </span>
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        updateContent((prev) => ({
                          ...prev,
                          faq: {
                            ...prev.faq,
                            items: [
                              ...prev.faq.items,
                              {
                                id: `faq-${Date.now()}`,
                                question: {
                                  ID: "Pertanyaan baru...",
                                  EN: "New question...",
                                },
                                answer: {
                                  ID: "Jawaban lengkap...",
                                  EN: "Detailed answer...",
                                },
                              },
                            ],
                          },
                        }))
                      }
                      className="px-3.5 py-2 rounded-xl bg-[#005B94] hover:bg-[#00A3FF] text-white hover:text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <HiPlus aria-hidden="true" className="w-4 h-4" />
                      <span>Tambah FAQ</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {content.faq.items.map((item: FaqItem, idx: number) => (
                      <div
                        key={item.id || idx}
                        className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-[#00A3FF]">
                            FAQ #{idx + 1} ({editLang})
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteConfirm({
                                type: "faq",
                                index: idx,
                                title: item.question[editLang],
                              })
                            }
                            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                          >
                            <HiTrash aria-hidden="true" className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">
                            Pertanyaan ({editLang})
                          </label>
                          <input
                            type="text"
                            value={item.question[editLang]}
                            onChange={(e) =>
                              updateContent((prev) => {
                                const nextFaq = [...prev.faq.items];
                                nextFaq[idx] = {
                                  ...nextFaq[idx],
                                  question: {
                                    ...nextFaq[idx].question,
                                    [editLang]: e.target.value,
                                  },
                                };
                                return {
                                  ...prev,
                                  faq: { ...prev.faq, items: nextFaq },
                                };
                              })
                            }
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A3FF]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">
                            Jawaban ({editLang})
                          </label>
                          <textarea
                            rows={2}
                            value={item.answer[editLang]}
                            onChange={(e) =>
                              updateContent((prev) => {
                                const nextFaq = [...prev.faq.items];
                                nextFaq[idx] = {
                                  ...nextFaq[idx],
                                  answer: {
                                    ...nextFaq[idx].answer,
                                    [editLang]: e.target.value,
                                  },
                                };
                                return {
                                  ...prev,
                                  faq: { ...prev.faq, items: nextFaq },
                                };
                              })
                            }
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A3FF]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Floating Unsaved Changes Bar */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-2xl bg-[#0B192C]/95 backdrop-blur-xl border border-[#00A3FF]/50 rounded-2xl p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs">
            <span className="w-3 h-3 rounded-full bg-[#00A3FF] animate-ping shrink-0" />
            <div>
              <p className="font-extrabold text-white">
                Anda Memiliki Perubahan yang Belum Di-Commit
              </p>
              <p className="text-slate-400">
                Klik tombol Save / Publish untuk mengirim commit terbaru ke
                GitHub Repository.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePublishToGitHub}
            disabled={committing}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#005B94] to-[#00A3FF] text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shrink-0 cursor-pointer"
          >
            <HiCloudArrowUp aria-hidden="true" className="w-4 h-4" />
            <span>{committing ? "Committing..." : "Save & Publish"}</span>
          </button>
        </div>
      )}

      {/* MODAL: CREATE / UPDATE PRODUCT */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B192C] border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00A3FF] block">
                  {editingProductIndex !== null
                    ? "UPDATE PRODUK / LAYANAN"
                    : "CREATE PRODUK / LAYANAN BARU"}
                </span>
                <h3 className="text-lg font-extrabold text-white">
                  {editingProductIndex !== null
                    ? `Edit: ${productForm.name.ID || productForm.name.EN}`
                    : "Tambah Produk / Layanan Baru"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
              >
                <HiXMark aria-hidden="true" className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form
              onSubmit={handleSaveProductModal}
              className="p-6 overflow-y-auto space-y-4 flex-1"
            >
              {productFormError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <HiExclamationTriangle aria-hidden="true" className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{productFormError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nomor Urut *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.number}
                    onChange={(e) =>
                      setProductForm({ ...productForm, number: e.target.value })
                    }
                    placeholder="01"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Kategori *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  >
                    <option value="Investigation">Investigation</option>
                    <option value="Drilling">Drilling</option>
                    <option value="Installation">Installation</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Permitting">Permitting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Status Badge *
                  </label>
                  <select
                    value={productForm.status}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        status: e.target.value as ProductItem["status"],
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  >
                    <option value="Featured">Featured (Unggulan)</option>
                    <option value="Active">Active (Aktif)</option>
                    <option value="Draft">Draft (Sembunyikan)</option>
                  </select>
                </div>
              </div>

              {/* Names ID & EN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nama Produk / Layanan (ID) *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name.ID}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        name: { ...productForm.name, ID: e.target.value },
                      })
                    }
                    placeholder="Misal: Investigasi Air Tanah"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nama Produk / Layanan (EN) *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name.EN}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        name: { ...productForm.name, EN: e.target.value },
                      })
                    }
                    placeholder="e.g. Ground Water Investigation"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Label Harga (ID / EN)
                  </label>
                  <input
                    type="text"
                    value={productForm.priceLabel.ID}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        priceLabel: {
                          ID: e.target.value,
                          EN:
                            productForm.priceLabel.EN ||
                            (e.target.value.toLowerCase().includes("mulai")
                              ? "Starting from"
                              : "Price"),
                        },
                      })
                    }
                    placeholder="Mulai dari / Biaya"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nominal / Teks Harga *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.price.ID}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        price: { ID: e.target.value, EN: e.target.value },
                      })
                    }
                    placeholder="IDR 12,000,000 atau Request Quotation"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>
              </div>

              {/* Image Uploader */}
              <ImageUploaderField
                label="Gambar Produk / Layanan"
                value={productForm.image}
                onNotify={addToast}
                onChange={(newUrl) =>
                  setProductForm({ ...productForm, image: newUrl })
                }
              />

              {/* Short Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Deskripsi Singkat (ID) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={productForm.shortDesc.ID}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        shortDesc: {
                          ...productForm.shortDesc,
                          ID: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Deskripsi Singkat (EN) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={productForm.shortDesc.EN}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        shortDesc: {
                          ...productForm.shortDesc,
                          EN: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              {/* Full Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Deskripsi Lengkap Modal (ID)
                  </label>
                  <textarea
                    rows={3}
                    value={productForm.fullDesc.ID}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        fullDesc: {
                          ...productForm.fullDesc,
                          ID: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Deskripsi Lengkap Modal (EN)
                  </label>
                  <textarea
                    rows={3}
                    value={productForm.fullDesc.EN}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        fullDesc: {
                          ...productForm.fullDesc,
                          EN: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              {/* Includes Bullet Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Cakupan Layanan ID (1 poin per baris)
                  </label>
                  <textarea
                    rows={3}
                    value={includesInputID}
                    onChange={(e) => setIncludesInputID(e.target.value)}
                    placeholder="Survei lokasi lapangan&#10;Investigasi geolistrik"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Cakupan Layanan EN (1 poin per baris)
                  </label>
                  <textarea
                    rows={3}
                    value={includesInputEN}
                    onChange={(e) => setIncludesInputEN(e.target.value)}
                    placeholder="Site assessment&#10;Geoelectric investigation"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#005B94] to-[#00A3FF] text-white text-xs font-extrabold uppercase tracking-wider shadow-lg cursor-pointer"
                >
                  {editingProductIndex !== null
                    ? "Simpan Perubahan Produk"
                    : "Tambahkan Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / UPDATE PROJECT */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B192C] border border-slate-800 rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <h3 className="text-base font-extrabold text-white">
                {editingProjectIndex !== null
                  ? `Edit Proyek: ${projectForm.title}`
                  : "Tambah Proyek Baru"}
              </h3>
              <button
                type="button"
                onClick={() => setIsProjectModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center"
              >
                <HiXMark aria-hidden="true" className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSaveProjectModal}
              className="p-6 overflow-y-auto space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nama Proyek *
                </label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Lokasi *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.location}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        location: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Tanggal / Periode *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.date}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, date: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Scope Pekerjaan *
                </label>
                <input
                  type="text"
                  required
                  value={projectForm.scope}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, scope: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Final Depth
                  </label>
                  <input
                    type="text"
                    value={projectForm.finalDepth}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        finalDepth: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Water Encounter
                  </label>
                  <input
                    type="text"
                    value={projectForm.waterEncounter}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        waterEncounter: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Water Discharge
                  </label>
                  <input
                    type="text"
                    value={projectForm.waterDischarge}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        waterDischarge: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <ImageUploaderField
                label="Thumbnail Proyek"
                value={projectForm.image}
                onNotify={addToast}
                onChange={(newUrl) =>
                  setProjectForm({ ...projectForm, image: newUrl })
                }
              />

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#005B94] to-[#00A3FF] text-white text-xs font-extrabold uppercase cursor-pointer"
                >
                  Simpan Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DESTRUCTIVE DELETE CONFIRMATION */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B192C] border border-red-500/30 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                <HiExclamationTriangle aria-hidden="true" className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  Konfirmasi Penghapusan Item
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Apakah Anda yakin ingin menghapus{" "}
                  <strong className="text-white">
                    &ldquo;{deleteConfirm.title}&rdquo;
                  </strong>
                  ? Perubahan akan diterapkan ke repository setelah Anda menekan
                  tombol Save / Publish.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-red-600/20 cursor-pointer"
              >
                Ya, Hapus Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

