import { randomUUID } from "crypto";
import { evidences } from "../data/seed";
import {
    AddEvidenceRequest,
    Evidence,
} from "../types/evidence.types";

export class EvidenceRepository {
    findByProjectId(projectId: string): Evidence[] {
        return evidences.filter(
            (evidence) => evidence.projectId === projectId
        );
    }

    create(
        projectId: string,
        payload: AddEvidenceRequest
    ): Evidence {
        const uniqueId = randomUUID();

        const evidence: Evidence = {
            id: uniqueId,
            projectId,
            evidenceType: payload.evidenceType,
            fileName: payload.fileName,
            uploadedBy: payload.uploadedBy,

            // Masih dummy. Nanti diganti hasil Walrus dan Sui asli.
            walrusBlobId: `mock_walrus_blob_${uniqueId}`,
            evidenceHash: `mock_evidence_hash_${uniqueId}`,
            transactionDigest: `mock_sui_tx_${uniqueId}`,

            createdAt: new Date().toISOString(),
        };

        evidences.push(evidence);

        return evidence;
    }
}