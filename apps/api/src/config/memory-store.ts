import { CarbonProject } from "../types/project.types";
import { Evidence } from "../types/evidence.types";
import { VerificationReport } from "../types/verification.types";

type MemoryStore = {
    projects: Map<string, CarbonProject>;
    evidences: Map<string, Evidence>;
    reports: Map<string, VerificationReport>;
};

const globalForMemory = globalThis as unknown as {
    carbonProofMemoryStore?: MemoryStore;
};

export const memoryStore =
    globalForMemory.carbonProofMemoryStore ?? {
        projects: new Map<string, CarbonProject>(),
        evidences: new Map<string, Evidence>(),
        reports: new Map<string, VerificationReport>(),
    };

globalForMemory.carbonProofMemoryStore = memoryStore;
