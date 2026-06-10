import { CarbonProject } from "../types/project.types";
import { Evidence } from "../types/evidence.types";
import { VerificationReport } from "../types/verification.types";

const now = new Date().toISOString();

export const projects: CarbonProject[] = [
    {
        id: "project_001",
        name: "Mangrove Restoration — Bekasi Coastal Area",
        location: "Bekasi Coastal Area, Indonesia",
        claim: "10,000 mangrove trees planted",
        description:
            "A coastal restoration project that plants and monitors mangrove trees to support carbon sequestration and ecosystem recovery.",
        status: "pending_evidence",
        ownerWallet: "0xproject_owner_dummy",
        createdAt: now,
        updatedAt: now,
    },
];

export const evidences: Evidence[] = [
    {
        id: "evidence_001",
        projectId: "project_001",
        evidenceType: "audit_report_pdf",
        fileName: "mangrove-audit-report.pdf",
        walrusBlobId: "mock_walrus_blob_audit_001",
        evidenceHash: "mock_evidence_hash_audit_001",
        transactionDigest: "mock_sui_tx_audit_001",
        uploadedBy: "0xproject_owner_dummy",
        createdAt: now,
    },
    {
        id: "evidence_002",
        projectId: "project_001",
        evidenceType: "drone_image",
        fileName: "mangrove-drone-image.png",
        walrusBlobId: "mock_walrus_blob_drone_001",
        evidenceHash: "mock_evidence_hash_drone_001",
        transactionDigest: "mock_sui_tx_drone_001",
        uploadedBy: "0xproject_owner_dummy",
        createdAt: now,
    },
];

export const verificationReports: VerificationReport[] = [];