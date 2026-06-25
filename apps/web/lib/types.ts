export type CarbonProjectStatus =
  | "draft"
  | "pending_evidence"
  | "ai_reviewed"
  | "verified"
  | "credit_issued";

export type EvidenceType =
  | "audit_report_pdf"
  | "drone_image"
  | "sensor_csv"
  | "gps_metadata_json"
  | "survival_rate_report"
  | "auditor_signature";

export type RiskScore = "Low" | "Medium" | "High";

export interface CarbonProject {
  id: string;
  name: string;
  location: string;
  claim: string;
  description: string;
  status: CarbonProjectStatus;
  ownerWallet: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  name: string;
  location: string;
  claim: string;
  description: string;
  ownerWallet?: string;
}

export interface Evidence {
  id: string;
  projectId: string;
  evidenceType: EvidenceType;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  storagePath: string;
  evidenceHash: string;
  walrusBlobId?: string | null;
  walrusBlobUrl?: string | null;
  walrusObjectId?: string | null;
  suiObjectId?: string | null;
  transactionDigest?: string | null;
  uploadedBy?: string | null;
  createdAt: string;
}

export interface ExtractedFact {
  field: string;
  value: string;
  sourceEvidenceId: string;
  confidence: number;
}

export interface VerificationReport {
  id: string;
  projectId: string;
  summary: string;
  riskScore: RiskScore;
  confidenceScore: number;
  verifiedEvidence: string[];
  missingEvidence: string[];
  inconsistencies: string[];
  extractedFacts: ExtractedFact[];
  recommendation: string;
  model: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ProjectDetail extends CarbonProject {
  evidences: Evidence[];
  verificationReport: VerificationReport | null;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: unknown;
}

export interface ApiHealth {
  service: string;
  status: "healthy" | "degraded";
  database: "connected" | "disconnected" | "memory";
  timestamp: string;
}

export interface EvidenceUploadInput {
  file: File;
  evidenceType: EvidenceType;
  uploadedBy?: string;
}
