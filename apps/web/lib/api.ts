import type {
  ApiEnvelope,
  ApiHealth,
  CarbonProject,
  CreateProjectInput,
  Evidence,
  EvidenceUploadInput,
  ProjectDetail,
  VerificationReport,
} from "@/lib/types";

export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://carbonproof-ai-api.vercel.app"
).replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...init?.headers,
      },
      cache: "no-store",
      signal: init?.signal || AbortSignal.timeout(20_000),
    });
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === "TimeoutError";
    throw new ApiError(
      timedOut ? "CarbonProof API request timed out" : "Unable to reach the CarbonProof API",
      timedOut ? 408 : 0,
      error,
    );
  }

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !payload?.success) {
    throw new ApiError(
      payload?.message || `Request failed with status ${response.status}`,
      response.status,
      payload?.errors,
    );
  }

  return payload.data;
}

export const api = {
  getHealth: () => request<ApiHealth>("/api/health"),
  getProjects: () => request<CarbonProject[]>("/api/projects"),
  createProject: (input: CreateProjectInput) =>
    request<CarbonProject>("/api/projects", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  getProject: (id: string) => request<ProjectDetail>(`/api/projects/${id}`),
  uploadEvidence: (id: string, input: EvidenceUploadInput) => {
    const body = new FormData();
    body.append("file", input.file);
    body.append("evidenceType", input.evidenceType);
    if (input.uploadedBy) body.append("uploadedBy", input.uploadedBy);

    return request<Evidence>(`/api/projects/${id}/evidence`, {
      method: "POST",
      body,
    });
  },
  verifyProject: (id: string) =>
    request<VerificationReport>(`/api/projects/${id}/verify`, { method: "POST" }),
  getVerificationReport: (id: string) =>
    request<VerificationReport>(`/api/projects/${id}/verification-report`),
};
