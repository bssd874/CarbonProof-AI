import { randomUUID } from "node:crypto";

import { env } from "../config/env";
import { EvidenceRepository } from "../repositories/evidence.repository";
import { ProjectRepository } from "../repositories/project.repository";
import { VerificationRepository } from "../repositories/verification.repository";
import { VerificationReport } from "../types/verification.types";
import { AppError } from "../utils/app-error";
import { AiVerifierService } from "./ai-verifier.service";

export class VerificationService {
    private readonly projectRepository =
        new ProjectRepository();

    private readonly evidenceRepository =
        new EvidenceRepository();

    private readonly verificationRepository =
        new VerificationRepository();

    private readonly aiVerifierService =
        new AiVerifierService();

    async verifyProject(
        projectId: string
    ): Promise<VerificationReport | null> {
        const project =
            await this.projectRepository.findById(
                projectId
            );

        if (!project) {
            return null;
        }

        const evidences =
            await this.evidenceRepository
                .findByProjectId(projectId);

        if (evidences.length === 0) {
            throw new AppError(
                "Project has no evidence to verify",
                409
            );
        }

        /*
         * Memanggil Gemini secara real.
         * Output sudah divalidasi menggunakan Zod
         * di dalam AiVerifierService.
         */
        const aiResult =
            await this.aiVerifierService.verify(
                project,
                evidences
            );

        const report: VerificationReport = {
            id: randomUUID(),
            projectId: project.id,

            summary: aiResult.summary,
            riskScore: aiResult.riskScore,

            confidenceScore:
                aiResult.confidenceScore,

            verifiedEvidence:
                aiResult.verifiedEvidence,

            missingEvidence:
                aiResult.missingEvidence,

            inconsistencies:
                aiResult.inconsistencies,

            extractedFacts:
                aiResult.extractedFacts,

            recommendation:
                aiResult.recommendation,

            model:
                env.aiProvider === "mock"
                    ? "mock-risk-engine"
                    : env.geminiModel,

            createdAt:
                new Date().toISOString(),
        };

        /*
         * Upsert report ke PostgreSQL.
         * Jika project sudah pernah diverifikasi,
         * report lama akan diperbarui.
         */
        const savedReport =
            await this.verificationRepository.save(
                report
            );

        /*
         * Status project hanya diubah setelah:
         * 1. Gemini berhasil merespons.
         * 2. JSON berhasil divalidasi.
         * 3. Report berhasil disimpan.
         */
        await this.projectRepository.updateStatus(
            projectId,
            "ai_reviewed"
        );

        return savedReport;
    }

    async getReport(
        projectId: string
    ): Promise<VerificationReport | null> {
        const report =
            await this.verificationRepository
                .findByProjectId(projectId);

        return report ?? null;
    }
}
