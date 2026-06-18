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
    originalName: string;
    mimeType: string;
    fileSize: number;
    storagePath: string;
    evidenceHash: string;

    walrusBlobId?: string | null;
    walrusObjectId?: string | null;
    suiObjectId?: string | null;
    transactionDigest?: string | null;
    uploadedBy?: string | null;

    createdAt: string;
}

export interface EvidenceProofMetadata {
    walrusBlobId?: string;
    walrusObjectId?: string;
    suiObjectId?: string;
    transactionDigest?: string;
}

export interface CreateEvidenceData {
    evidenceType: EvidenceType;

    fileName: string;
    originalName: string;
    mimeType: string;
    fileSize: number;
    storagePath: string;
    evidenceHash: string;

    uploadedBy?: string;
    proofMetadata?: EvidenceProofMetadata;
}
