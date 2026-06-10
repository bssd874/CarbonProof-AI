import { randomUUID } from "crypto";
import {
    EVIDENCE_LABELS,
    REQUIRED_EVIDENCE_TYPES,
} from "../constants/evidence.constants";
import { CarbonProject } from "../types/project.types";
import { Evidence } from "../types/evidence.types";
import {
    RiskScore,
    VerificationReport,
} from "../types/verification.types";

export class AiVerifierService {
    verify(
        project: CarbonProject,
        evidences: Evidence[]
    ): VerificationReport {
        const uploadedEvidenceTypes = new Set(
            evidences.map((evidence) => evidence.evidenceType)
        );

        const verifiedEvidence = REQUIRED_EVIDENCE_TYPES
            .filter((type) => uploadedEvidenceTypes.has(type))
            .map((type) => EVIDENCE_LABELS[type]);

        const missingEvidence = REQUIRED_EVIDENCE_TYPES
            .filter((type) => !uploadedEvidenceTypes.has(type))
            .map((type) => EVIDENCE_LABELS[type]);

        const riskScore = this.calculateRiskScore(
            verifiedEvidence.length
        );

        return {
            id: randomUUID(),
            projectId: project.id,

            summary:
                `The project "${project.name}" claims "${project.claim}" ` +
                `in ${project.location}. ` +
                `${verifiedEvidence.length} of ` +
                `${REQUIRED_EVIDENCE_TYPES.length} required evidence items ` +
                `are currently available.`,

            riskScore,
            verifiedEvidence,
            missingEvidence,
            recommendation: this.generateRecommendation(riskScore),
            createdAt: new Date().toISOString(),
        };
    }

    private calculateRiskScore(
        verifiedEvidenceCount: number
    ): RiskScore {
        if (verifiedEvidenceCount >= 5) {
            return "Low";
        }

        if (verifiedEvidenceCount >= 3) {
            return "Medium";
        }

        return "High";
    }

    private generateRecommendation(
        riskScore: RiskScore
    ): string {
        if (riskScore === "Low") {
            return (
                "Evidence coverage is strong. " +
                "The project may proceed to auditor review and Impact Credit issuance."
            );
        }

        if (riskScore === "Medium") {
            return (
                "Request the remaining supporting evidence before issuing credits, " +
                "especially the survival-rate report and auditor signature."
            );
        }

        return (
            "Do not issue credits yet. " +
            "The project requires stronger field evidence, monitoring data, " +
            "and third-party verification."
        );
    }
}