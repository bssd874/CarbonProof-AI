import type { CarbonProjectStatus, EvidenceType } from "@/lib/types";

export const projectStatusLabels: Record<CarbonProjectStatus, string> = {
  draft: "Draft",
  pending_evidence: "Evidence pending",
  ai_reviewed: "AI reviewed",
  verified: "Verified",
  credit_issued: "Credit issued",
};

export const evidenceTypeLabels: Record<EvidenceType, string> = {
  audit_report_pdf: "Audit report PDF",
  drone_image: "Drone image",
  sensor_csv: "Sensor readings CSV",
  gps_metadata_json: "GPS metadata JSON",
  survival_rate_report: "Survival-rate report",
  auditor_signature: "Auditor attestation",
};

export function shorten(value?: string | null, head = 8, tail = 6) {
  if (!value) return "Not available";
  if (value.length <= head + tail + 3) return value;
  return `${value.slice(0, head)}...${value.slice(-tail)}`;
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function suiTransactionUrl(digest: string) {
  return `https://suiscan.xyz/testnet/tx/${encodeURIComponent(digest)}`;
}
