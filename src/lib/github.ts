import defaultContentJson from "../../content.json";
import type { CMSContent } from "@/types/cms";

export const defaultContent: CMSContent = defaultContentJson as CMSContent;

export interface GitHubConfig {
  pat: string;
  owner: string;
  repo: string;
  branch: string;
  isConfigured: boolean;
}

export function getGitHubConfig(): GitHubConfig {
  const pat = (process.env.GITHUB_PAT || "").trim();
  const owner = (process.env.GITHUB_OWNER || "krisnasirait").trim();
  const repo = (process.env.GITHUB_REPO || "dryno").trim();
  const branch = (process.env.GITHUB_BRANCH || "main").trim();

  const isPlaceholderPat =
    !pat ||
    pat === "ghp_xxxxxxxxxxxxxxxxxxxx" ||
    pat.includes("xxxxxxxx") ||
    pat === "your_github_pat_here";

  const isPlaceholderRepo =
    !owner ||
    !repo ||
    owner === "username_atau_org" ||
    repo === "nama_repo";

  return {
    pat,
    owner,
    repo,
    branch,
    isConfigured: !isPlaceholderPat && !isPlaceholderRepo,
  };
}

function buildGitHubHeaders(pat?: string): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "DRYNO-CMS-Integration",
  };
  if (pat && !pat.includes("xxxxxxxx") && pat !== "ghp_xxxxxxxxxxxxxxxxxxxx") {
    headers.Authorization = `Bearer ${pat}`;
  }
  return headers;
}

export function mergeWithDefaultContent(partial: Partial<CMSContent>): CMSContent {
  return {
    updatedAt: partial.updatedAt || defaultContent.updatedAt,
    hero: {
      ...defaultContent.hero,
      ...(partial.hero || {}),
      images:
        Array.isArray(partial.hero?.images) && partial.hero.images.length > 0
          ? partial.hero.images
          : defaultContent.hero.images,
    },
    about: {
      ...defaultContent.about,
      ...(partial.about || {}),
    },
    waterChallenges: {
      ...defaultContent.waterChallenges,
      ...(partial.waterChallenges || {}),
      articles: Array.isArray(partial.waterChallenges?.articles)
        ? partial.waterChallenges.articles
        : defaultContent.waterChallenges.articles,
    },
    servicesMeta: {
      ...defaultContent.servicesMeta,
      ...(partial.servicesMeta || {}),
    },
    products: Array.isArray(partial.products)
      ? partial.products
      : defaultContent.products,
    projects: Array.isArray(partial.projects)
      ? partial.projects
      : defaultContent.projects,
    equipment: {
      ...defaultContent.equipment,
      ...(partial.equipment || {}),
      items: Array.isArray(partial.equipment?.items)
        ? partial.equipment.items
        : defaultContent.equipment.items,
    },
    faq: {
      ...defaultContent.faq,
      ...(partial.faq || {}),
      items: Array.isArray(partial.faq?.items)
        ? partial.faq.items
        : defaultContent.faq.items,
    },
    contact: {
      ...defaultContent.contact,
      ...(partial.contact || {}),
    },
  };
}

export interface FetchGitHubContentResult {
  content: CMSContent;
  sha: string | null;
  synced: boolean;
  source: "github" | "github-uninitialized" | "fallback";
  message?: string;
  repoInfo: {
    owner: string;
    repo: string;
    branch: string;
    isConfigured: boolean;
  };
}

export async function fetchContentFromGitHub(): Promise<FetchGitHubContentResult> {
  const config = getGitHubConfig();
  const { pat, owner, repo, branch, isConfigured } = config;

  const repoInfo = { owner, repo, branch, isConfigured };

  if (owner === "username_atau_org" || repo === "nama_repo") {
    return {
      content: defaultContent,
      sha: null,
      synced: false,
      source: "fallback",
      message:
        "Environment variables GITHUB_OWNER / GITHUB_REPO masih menggunakan nilai contoh. Silakan sesuaikan di .env.",
      repoInfo,
    };
  }

  const url = `https://api.github.com/repos/${encodeURIComponent(
    owner
  )}/${encodeURIComponent(repo)}/contents/content.json?ref=${encodeURIComponent(
    branch
  )}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: buildGitHubHeaders(pat),
      cache: "no-store",
    });

    if (res.status === 404) {
      return {
        content: defaultContent,
        sha: null,
        synced: isConfigured,
        source: "github-uninitialized",
        message: isConfigured
          ? "File content.json belum ada di repository GitHub. Klik 'Save & Publish to GitHub' untuk membuat file content.json pertama kali."
          : "File content.json belum ada di branch GitHub dan GITHUB_PAT belum dikonfigurasi.",
        repoInfo,
      };
    }

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const errMsg =
        errBody?.message || `GitHub API merespons dengan status ${res.status}`;
      return {
        content: defaultContent,
        sha: null,
        synced: false,
        source: "fallback",
        message: !isConfigured
          ? "GITHUB_PAT belum dikonfigurasi dengan benar di .env. Menampilkan data default repository."
          : `Gagal sinkronisasi dari GitHub (${res.status}): ${errMsg}`,
        repoInfo,
      };
    }

    const data = await res.json();
    const rawBase64 = typeof data.content === "string" ? data.content : "";
    const decodedJson = Buffer.from(rawBase64, "base64").toString("utf-8");
    const parsed = JSON.parse(decodedJson) as Partial<CMSContent>;

    return {
      content: mergeWithDefaultContent(parsed),
      sha: data.sha || null,
      synced: true,
      source: "github",
      message: isConfigured
        ? "Tersinkronisasi langsung dengan GitHub Repository."
        : "Data dibaca dari GitHub (Public Read). Set GITHUB_PAT yang valid di .env untuk melakukan Commit/Publish.",
      repoInfo,
    };
  } catch (error) {
    const errMessage =
      error instanceof Error ? error.message : "Network error";
    return {
      content: defaultContent,
      sha: null,
      synced: false,
      source: "fallback",
      message: `Tidak dapat menghubungi GitHub API: ${errMessage}`,
      repoInfo,
    };
  }
}

export async function getFileShaFromGitHub(
  filePath: string
): Promise<string | null> {
  const { pat, owner, repo, branch } = getGitHubConfig();
  const cleanPath = filePath.replace(/^\/+/, "");
  const encodedPath = cleanPath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  const url = `https://api.github.com/repos/${encodeURIComponent(
    owner
  )}/${encodeURIComponent(repo)}/contents/${encodedPath}?ref=${encodeURIComponent(
    branch
  )}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: buildGitHubHeaders(pat),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data?.sha === "string" ? data.sha : null;
  } catch {
    return null;
  }
}

export interface CommitContentResult {
  success: boolean;
  sha: string;
  commitSha: string;
  commitUrl: string;
  content: CMSContent;
}

export async function commitContentToGitHub(
  content: CMSContent,
  clientSha?: string | null,
  commitMessage?: string
): Promise<CommitContentResult> {
  const config = getGitHubConfig();
  const { pat, owner, repo, branch, isConfigured } = config;

  if (!isConfigured) {
    throw new Error(
      "Konfigurasi GitHub belum lengkap. Pastikan GITHUB_PAT, GITHUB_OWNER, GITHUB_REPO, dan GITHUB_BRANCH sudah diisi dengan benar di environment variables (.env)."
    );
  }

  const updatedContent: CMSContent = {
    ...content,
    updatedAt: new Date().toISOString(),
  };

  const jsonString = JSON.stringify(updatedContent, null, 2) + "\n";
  const base64Content = Buffer.from(jsonString, "utf-8").toString("base64");

  // Always fetch the latest SHA from GitHub to prevent 409 Conflict errors
  const latestSha = (await getFileShaFromGitHub("content.json")) || clientSha || undefined;

  const url = `https://api.github.com/repos/${encodeURIComponent(
    owner
  )}/${encodeURIComponent(repo)}/contents/content.json`;

  const payload: Record<string, string> = {
    message:
      commitMessage?.trim() ||
      `chore(cms): update content.json (${new Date().toISOString()})`,
    content: base64Content,
    branch,
  };

  if (latestSha) {
    payload.sha = latestSha;
  }

  let res = await fetch(url, {
    method: "PUT",
    headers: {
      ...buildGitHubHeaders(pat),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  // If 409 Conflict or 422 SHA mismatch happens, re-fetch latest SHA once and retry
  if (res.status === 409 || res.status === 422) {
    const freshSha = await getFileShaFromGitHub("content.json");
    if (freshSha && freshSha !== payload.sha) {
      payload.sha = freshSha;
      res = await fetch(url, {
        method: "PUT",
        headers: {
          ...buildGitHubHeaders(pat),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });
    }
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    const errMsg =
      errBody?.message || `GitHub API gagal melakukan commit (HTTP ${res.status})`;
    throw new Error(errMsg);
  }

  const data = await res.json();

  return {
    success: true,
    sha: data?.content?.sha || "",
    commitSha: data?.commit?.sha || "",
    commitUrl: data?.commit?.html_url || "",
    content: updatedContent,
  };
}

export interface UploadImageResult {
  url: string;
  rawUrl: string;
  repoPath: string;
  sha: string;
  commitUrl: string;
}

export async function uploadImageToGitHub(
  fileBuffer: ArrayBuffer,
  originalFileName: string
): Promise<UploadImageResult> {
  const config = getGitHubConfig();
  const { pat, owner, repo, branch, isConfigured } = config;

  if (!isConfigured) {
    throw new Error(
      "GITHUB_PAT belum dikonfigurasi dengan benar di .env. Upload gambar langsung ke GitHub membutuhkan Classic PAT dengan permission 'repo'."
    );
  }

  // Sanitize file name (purely in-memory, NO fs or mkdir!)
  const extMatch = originalFileName.match(/\.[a-zA-Z0-9]+$/);
  const ext = extMatch ? extMatch[0].toLowerCase() : ".jpg";
  const baseName = originalFileName
    .replace(/\.[a-zA-Z0-9]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "image";

  const safeFileName = `${Date.now()}-${baseName}${ext}`;
  const repoPath = `public/images/uploads/${safeFileName}`;

  const base64Content = Buffer.from(fileBuffer).toString("base64");
  const existingSha = await getFileShaFromGitHub(repoPath);

  const encodedPath = repoPath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  const url = `https://api.github.com/repos/${encodeURIComponent(
    owner
  )}/${encodeURIComponent(repo)}/contents/${encodedPath}`;

  const payload: Record<string, string> = {
    message: `chore(cms): upload image ${safeFileName}`,
    content: base64Content,
    branch,
  };

  if (existingSha) {
    payload.sha = existingSha;
  }

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      ...buildGitHubHeaders(pat),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    const errMsg =
      errBody?.message || `Gagal mengunggah gambar ke GitHub (HTTP ${res.status})`;
    throw new Error(errMsg);
  }

  const data = await res.json();
  const rawUrl =
    data?.content?.download_url ||
    `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${repoPath}`;

  // Return the relative path `/images/uploads/${safeFileName}` which is also served dynamically via `/images/uploads/[...path]` before rebuild
  return {
    url: `/images/uploads/${safeFileName}`,
    rawUrl,
    repoPath,
    sha: data?.content?.sha || "",
    commitUrl: data?.commit?.html_url || "",
  };
}

