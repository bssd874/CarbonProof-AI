export type EvidenceType =
    | "audit_report_pdf"
    | "drone_image"
    | "sensor_csv"
    | "gps_metadata_json"
    | "survival_rate_report"
    | "auditor_signature";

export interface Evidence {
    id: string;
    projectId: string;
    evidenceType: EvidenceType;
    fileName: string;

    walrusBlobId?: string;
    evidenceHash?: string;
    transactionDigest?: string;

    uploadedBy?: string;
    createdAt: string;
}

export interface AddEvidenceRequest {
    evidenceType: EvidenceType;
    fileName: string;
    uploadedBy?: string;
}