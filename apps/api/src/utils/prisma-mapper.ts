import {
    CarbonProjectStatus as PrismaProjectStatus,
    EvidenceType as PrismaEvidenceType,
    RiskScore as PrismaRiskScore,
} from "../generated/prisma/client";

import { CarbonProjectStatus } from "../types/project.types";
import { EvidenceType } from "../types/evidence.types";
import { RiskScore } from "../types/verification.types";

export function toPrismaProjectStatus(
    status: CarbonProjectStatus
): PrismaProjectStatus {
    const mapper: Record<
        CarbonProjectStatus,
        PrismaProjectStatus
    > = {
        draft: PrismaProjectStatus.DRAFT,
        pending_evidence:
            PrismaProjectStatus.PENDING_EVIDENCE,
        ai_reviewed:
            PrismaProjectStatus.AI_REVIEWED,
        verified:
            PrismaProjectStatus.VERIFIED,
        credit_issued:
            PrismaProjectStatus.CREDIT_ISSUED,
    };

    return mapper[status];
}

export function fromPrismaProjectStatus(
    status: PrismaProjectStatus
): CarbonProjectStatus {
    const mapper: Record<
        PrismaProjectStatus,
        CarbonProjectStatus
    > = {
        DRAFT: "draft",
        PENDING_EVIDENCE: "pending_evidence",
        AI_REVIEWED: "ai_reviewed",
        VERIFIED: "verified",
        CREDIT_ISSUED: "credit_issued",
    };

    return mapper[status];
}

export function toPrismaEvidenceType(
    type: EvidenceType
): PrismaEvidenceType {
    const mapper: Record<
        EvidenceType,
        PrismaEvidenceType
    > = {
        audit_report_pdf:
            PrismaEvidenceType.AUDIT_REPORT_PDF,

        drone_image:
            PrismaEvidenceType.DRONE_IMAGE,

        sensor_csv:
            PrismaEvidenceType.SENSOR_CSV,

        gps_metadata_json:
            PrismaEvidenceType.GPS_METADATA_JSON,

        survival_rate_report:
            PrismaEvidenceType.SURVIVAL_RATE_REPORT,

        auditor_signature:
            PrismaEvidenceType.AUDITOR_SIGNATURE,
    };

    return mapper[type];
}

export function fromPrismaEvidenceType(
    type: PrismaEvidenceType
): EvidenceType {
    const mapper: Record<
        PrismaEvidenceType,
        EvidenceType
    > = {
        AUDIT_REPORT_PDF: "audit_report_pdf",
        DRONE_IMAGE: "drone_image",
        SENSOR_CSV: "sensor_csv",
        GPS_METADATA_JSON: "gps_metadata_json",
        SURVIVAL_RATE_REPORT:
            "survival_rate_report",
        AUDITOR_SIGNATURE: "auditor_signature",
    };

    return mapper[type];
}

export function toPrismaRiskScore(
    score: RiskScore
): PrismaRiskScore {
    const mapper: Record<
        RiskScore,
        PrismaRiskScore
    > = {
        Low: PrismaRiskScore.LOW,
        Medium: PrismaRiskScore.MEDIUM,
        High: PrismaRiskScore.HIGH,
    };

    return mapper[score];
}

export function fromPrismaRiskScore(
    score: PrismaRiskScore
): RiskScore {
    const mapper: Record<
        PrismaRiskScore,
        RiskScore
    > = {
        LOW: "Low",
        MEDIUM: "Medium",
        HIGH: "High",
    };

    return mapper[score];
}