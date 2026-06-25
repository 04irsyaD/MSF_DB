import {
  GenerateFromDDLRequest,
  GenerateFromDBRequest,
  GenerateJobResponse,
  JobStatusResponse,
  AIModelsResponse,
  DBTestConnectionResponse,
  DBMetadataResponse,
  ShortcutsResponse,
} from "./types";

const BASE_URL = ""; // Karena kita menggunakan rewrite di next.config.js, path relative ke "/api" akan dialihkan ke backend

export class ApiError extends Error {
  status: number;
  info: any;
  errorCode?: string;

  constructor(message: string, status: number, info?: any) {
    super(message);
    this.status = status;
    this.info = info;
    this.errorCode = info?.error_code || undefined;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  
  const headers = new Headers(options.headers);
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  // Tambah API Key header jika dikonfigurasi (untuk proteksi backend)
  const apiKey = process.env.NEXT_PUBLIC_MSF_API_KEY;
  if (apiKey) {
    headers.set("X-API-Key", apiKey);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let info = null;
    try {
      info = await response.json();
    } catch (_) {
      // ignore
    }
    throw new ApiError(
      info?.detail || `HTTP error! status: ${response.status}`,
      response.status,
      info
    );
  }

  // Handle file downloads
  const contentType = response.headers.get("Content-Type");
  if (contentType && (contentType.includes("application/octet-stream") || contentType.includes("application/vnd.openxmlformats-officedocument"))) {
    return response as any;
  }

  return response.json() as Promise<T>;
}

// SWR Fetcher helper
export const swrFetcher = (url: string) => request<any>(url);

export const api = {
  // AI Endpoints
  async listAIProviders(): Promise<any[]> {
    return request<any[]>("/api/ai/providers");
  },

  async listAIModels(provider: string): Promise<AIModelsResponse> {
    return request<AIModelsResponse>(`/api/ai/models?provider=${provider}`);
  },

  async testAIConnection(provider: string, model: string): Promise<any> {
    return request<any>("/api/ai/test", {
      method: "POST",
      body: JSON.stringify({ provider, model }),
    });
  },

  // DB Endpoints
  async testDBConnection(data: any): Promise<DBTestConnectionResponse> {
    return request<DBTestConnectionResponse>("/api/db/test-connection", {
      method: "POST",
      body: JSON.stringify({ connection: data }),
    });
  },

  async fetchDBMetadata(data: any): Promise<DBMetadataResponse> {
    return request<DBMetadataResponse>("/api/db/metadata", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Generate Endpoints
  async generateFromDDL(data: GenerateFromDDLRequest): Promise<GenerateJobResponse> {
    return request<GenerateJobResponse>("/api/generate/from-ddl", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async generateFromDB(data: GenerateFromDBRequest): Promise<GenerateJobResponse> {
    return request<GenerateJobResponse>("/api/generate/from-db", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Jobs Endpoints
  async getJobStatus(jobId: string): Promise<JobStatusResponse> {
    return request<JobStatusResponse>(`/api/jobs/${jobId}`);
  },

  async cancelJob(jobId: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/api/jobs/${jobId}/cancel`, {
      method: "POST",
    });
  },

  getDownloadUrl(jobId: string): string {
    return `/api/jobs/${jobId}/download`;
  },

  // Shortcuts Endpoints
  async listShortcuts(params: {
    engine?: string;
    category?: string;
    risk_level?: string;
    q?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<ShortcutsResponse> {
    const query = new URLSearchParams();
    if (params.engine) query.set("engine", params.engine);
    if (params.category) query.set("category", params.category);
    if (params.risk_level) query.set("risk_level", params.risk_level);
    if (params.q) query.set("q", params.q);
    if (params.limit) query.set("limit", String(params.limit));
    if (params.offset) query.set("offset", String(params.offset));

    return request<ShortcutsResponse>(`/api/shortcuts?${query.toString()}`);
  },

  async listShortcutEngines(): Promise<{ engines: string[] }> {
    return request<{ engines: string[] }>("/api/shortcuts/engines");
  },

  async listShortcutCategories(): Promise<{ categories: string[] }> {
    return request<{ categories: string[] }>("/api/shortcuts/categories");
  },

  // Direct Export
  async exportMarkdown(markdown: string, title: string): Promise<Blob> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const apiKey = process.env.NEXT_PUBLIC_MSF_API_KEY;
    if (apiKey) headers["X-API-Key"] = apiKey;

    const response = await fetch("/api/export/docx", {
      method: "POST",
      headers,
      body: JSON.stringify({ markdown_content: markdown, project_name: title }),
    });

    if (!response.ok) {
      throw new Error("Gagal mengunduh file Word");
    }

    return response.blob();
  },

  async exportPdf(markdown: string, title: string): Promise<Blob> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const apiKey = process.env.NEXT_PUBLIC_MSF_API_KEY;
    if (apiKey) headers["X-API-Key"] = apiKey;

    const response = await fetch("/api/export/pdf", {
      method: "POST",
      headers,
      body: JSON.stringify({ markdown_content: markdown, project_name: title }),
    });

    if (!response.ok) {
      throw new Error("Gagal mengunduh file PDF");
    }

    return response.blob();
  },
};

export function getFriendlyErrorMessage(err: any): string {
  if (err instanceof ApiError) {
    if (err.status === 400) return err.message;
    if (err.status === 401) return "Autentikasi gagal. Kunci API tidak valid atau konfigurasi salah.";
    if (err.status === 403) return "Akses ditolak. Anda tidak memiliki izin untuk mengakses fitur ini.";
    if (err.status === 404) return "Layanan tidak ditemukan (404). Silakan periksa kembali konfigurasi API URL.";
    if (err.status === 422) return err.message || "Data input tidak valid. Mohon periksa kembali form pengisian Anda.";
    if (err.status === 500) return "Terjadi kesalahan internal pada server (500). Mohon coba beberapa saat lagi.";
    if (err.status >= 502 && err.status <= 504) return "Server backend sedang sibuk atau mati (Gateway Timeout/Bad Gateway). Silakan coba lagi nanti.";
  }
  
  const msg = err?.message || "";
  if (msg.includes("Failed to fetch") || msg.includes("NetworkError") || msg.includes("ECONNRESET") || msg.includes("socket hang up")) {
    return "Gagal terhubung ke API server. Pastikan kontainer backend sedang berjalan dan dapat diakses.";
  }
  
  return msg || "Terjadi kesalahan tidak terduga.";
}
