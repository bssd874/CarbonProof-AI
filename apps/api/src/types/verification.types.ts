export type RiskScore = "Low" | "Medium" | "High";

export interface VerificationReport {
    id: string;
    projectId: string;
    summary: string;
    riskScore: RiskScore;
    verifiedEvidence: string[];
    missingEvidence: string[];
    recommendation: string;
    createdAt: string;
}