export type RiskScore =
    | "Low"
    | "Medium"
    | "High";

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