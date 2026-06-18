import { prisma } from "../config/database";
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
