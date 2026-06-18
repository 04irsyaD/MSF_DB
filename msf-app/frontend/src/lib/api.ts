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

  constructor(message: string, status: number, info?: any) {
    super(message);
    this.status = status;
    this.info = info;
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
    return request<DBTestConnectionResponse>("/api/db/test", {
      method: "POST",
      body: JSON.stringify(data),
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
    console.log("Generate Request:", data);
    console.log("API URL:", "/api/generate/from-ddl");
    return request<GenerateJobResponse>("/api/generate/from-ddl", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async generateFromDB(data: GenerateFromDBRequest): Promise<GenerateJobResponse> {
    console.log("Generate Request:", data);
    console.log("API URL:", "/api/generate/from-db");
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
    const response = await fetch("/api/export", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ markdown, title }),
    });

    if (!response.ok) {
      throw new Error("Gagal mengunduh file Word");
    }

    return response.blob();
  },
};
