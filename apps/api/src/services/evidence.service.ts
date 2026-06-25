import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import { EvidenceRepository } from "../repositories/evidence.repository";
import { ProjectRepository } from "../repositories/project.repository";
import {
    EvidenceProofMetadata,
    EvidenceType,
} from "../types/evidence.types";
import { calculateSha256 } from "../utils/file-hash";

type AddEvidenceInput = {
    evidenceType: EvidenceType;
    uploadedBy?: string;
    walrusBlobId?: string;
    walrusObjectId?: string;
    suiObjectId?: string;
    transactionDigest?: string;
    file: Express.Multer.File;
};

export class EvidenceService {
    private readonly projectRepository =
        new ProjectRepository();

    private readonly evidenceRepository =
        new EvidenceRepository();

    async addEvidence(
        projectId: string,
        input: AddEvidenceInput
    ) {
        const project =
            await this.projectRepository.findById(
                projectId
            );

        if (!project) {
            await fs.unlink(input.file.path).catch(
                () => undefined
            );

            return null;
        }

        const evidenceHash =
            await calculateSha256(input.file.path);

        const proofMetadata = {
            ...this.createDemoProofMetadata(
                projectId,
                evidenceHash
            ),
            ...(this.toProofMetadata(input) ?? {}),
        };

        return this.evidenceRepository.create(
            projectId,
            {
                evidenceType: input.evidenceType,

                fileName: input.file.filename,
                originalName:
                    input.file.originalname,
                mimeType: input.file.mimetype,
                fileSize: input.file.size,
                storagePath: input.file.path,
                evidenceHash,

                uploadedBy: input.uploadedBy,
                proofMetadata,
            }
        );
    }

    async syncProofMetadata(
        projectId: string,
        evidenceId: string,
        proofMetadata: EvidenceProofMetadata
    ) {
        return this.evidenceRepository
            .updateProofMetadata(
                projectId,
                evidenceId,
                proofMetadata
            );
    }

    private toProofMetadata(
        input: AddEvidenceInput
    ): EvidenceProofMetadata | undefined {
        const proofMetadata: EvidenceProofMetadata = {
            walrusBlobId: input.walrusBlobId,
            walrusObjectId: input.walrusObjectId,
            suiObjectId: input.suiObjectId,
            transactionDigest:
                input.transactionDigest,
        };

        const hasMetadata = Object.values(
            proofMetadata
        ).some(Boolean);

        return hasMetadata ? proofMetadata : undefined;
    }

    private createDemoProofMetadata(
        projectId: string,
        evidenceHash: string
    ): EvidenceProofMetadata {
        const seed = createHash("sha256")
            .update(`${projectId}:${evidenceHash}`)
            .digest("hex");

        return {
            walrusBlobId: `wal_${this.toBase58(seed, 43)}`,
            walrusObjectId: `0x${this.hashHex(`walrus:${seed}`)}`,
            suiObjectId: `0x${this.hashHex(`sui:${seed}`)}`,
            transactionDigest: this.toBase58(
                this.hashHex(`tx:${seed}`),
                44
            ),
        };
    }

    private hashHex(value: string) {
        return createHash("sha256")
            .update(value)
            .digest("hex");
    }

    private toBase58(hex: string, length: number) {
        const alphabet =
            "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
        const bytes = Buffer.from(hex, "hex");

        return Array.from(
            { length },
            (_, index) =>
                alphabet[
                    bytes[index % bytes.length] %
                        alphabet.length
                ]
        ).join("");
    }
}
