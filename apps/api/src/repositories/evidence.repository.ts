import { randomUUID } from "node:crypto";
import { prisma } from "../config/database";
import { env } from "../config/env";
import { memoryStore } from "../config/memory-store";
import {
    CreateEvidenceData,
    EvidenceProofMetadata,
} from "../types/evidence.types";
import {
    fromPrismaEvidenceType,
    toPrismaEvidenceType,
} from "../utils/prisma-mapper";

export class EvidenceRepository {
    async findByProjectId(projectId: string) {
        if (env.dataStore === "memory") {
            return Array.from(memoryStore.evidences.values())
                .filter((evidence) => evidence.projectId === projectId)
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        }

        const evidences =
            await prisma.evidence.findMany({
                where: {
                    projectId,
                },

                orderBy: {
                    createdAt: "desc",
                },
            });

        return evidences.map((evidence) => ({
            ...evidence,

            evidenceType:
                fromPrismaEvidenceType(
                    evidence.evidenceType
                ),

            createdAt:
                evidence.createdAt.toISOString(),
        }));
    }

    async create(
        projectId: string,
        payload: CreateEvidenceData
    ) {
        if (env.dataStore === "memory") {
            const proofMetadata = payload.proofMetadata ?? {};
            const evidence = {
                id: randomUUID(),
                projectId,
                evidenceType: payload.evidenceType,
                fileName: payload.fileName,
                originalName: payload.originalName,
                mimeType: payload.mimeType,
                fileSize: payload.fileSize,
                storagePath: payload.storagePath,
                evidenceHash: payload.evidenceHash,
                uploadedBy: payload.uploadedBy ?? null,
                walrusBlobId: proofMetadata.walrusBlobId ?? null,
                walrusObjectId: proofMetadata.walrusObjectId ?? null,
                suiObjectId: proofMetadata.suiObjectId ?? null,
                transactionDigest: proofMetadata.transactionDigest ?? null,
                createdAt: new Date().toISOString(),
            };

            memoryStore.evidences.set(evidence.id, evidence);
            return evidence;
        }

        const evidence =
            await prisma.evidence.create({
                data: {
                    projectId,

                    evidenceType:
                        toPrismaEvidenceType(
                            payload.evidenceType
                        ),

                    fileName: payload.fileName,
                    originalName: payload.originalName,
                    mimeType: payload.mimeType,
                    fileSize: payload.fileSize,
                    storagePath: payload.storagePath,
                    evidenceHash: payload.evidenceHash,

                    uploadedBy:
                        payload.uploadedBy,

                    walrusBlobId:
                        payload.proofMetadata
                            ?.walrusBlobId,
                    walrusObjectId:
                        payload.proofMetadata
                            ?.walrusObjectId,
                    suiObjectId:
                        payload.proofMetadata
                            ?.suiObjectId,
                    transactionDigest:
                        payload.proofMetadata
                            ?.transactionDigest,
                },
            });

        return {
            ...evidence,

            evidenceType:
                fromPrismaEvidenceType(
                    evidence.evidenceType
                ),

            createdAt:
                evidence.createdAt.toISOString(),
        };
    }

    async updateProofMetadata(
        projectId: string,
        evidenceId: string,
        proofMetadata: EvidenceProofMetadata
    ) {
        if (env.dataStore === "memory") {
            const evidence = memoryStore.evidences.get(evidenceId);

            if (!evidence || evidence.projectId !== projectId) {
                return undefined;
            }

            const updatedEvidence = {
                ...evidence,
                ...proofMetadata,
            };

            memoryStore.evidences.set(evidenceId, updatedEvidence);
            return updatedEvidence;
        }

        const existingEvidence =
            await prisma.evidence.findFirst({
                where: {
                    id: evidenceId,
                    projectId,
                },
            });

        if (!existingEvidence) {
            return undefined;
        }

        const evidence = await prisma.evidence.update({
            where: {
                id: evidenceId,
            },

            data: proofMetadata,
        });

        return {
            ...evidence,

            evidenceType:
                fromPrismaEvidenceType(
                    evidence.evidenceType
                ),

            createdAt:
                evidence.createdAt.toISOString(),
        };
    }
}
