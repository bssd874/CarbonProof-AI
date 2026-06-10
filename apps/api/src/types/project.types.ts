export type CarbonProjectStatus =
    | "draft"
    | "pending_evidence"
    | "ai_reviewed"
    | "verified"
    | "credit_issued";

export interface CarbonProject {
    id: string;
    name: string;
    location: string;
    claim: string;
    description: string;
    status: CarbonProjectStatus;
    ownerWallet?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProjectRequest {
    name: string;
    location: string;
    claim: string;
    description: string;
    ownerWallet?: string;
}