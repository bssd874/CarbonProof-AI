import { Prisma } from "../generated/prisma/client";
import { prisma } from "../config/database";
import { env } from "../config/env";
import { memoryStore } from "../config/memory-store";
import { VerificationReport } from "../types/verification.types";
import {
    fromPrismaRiskScore,
    toPrismaRiskScore,
} from "../utils/prisma-mapper";

function toPrismaJson(
    value: unknown
): Prisma.InputJsonValue {
    return JSON.parse(
        JSON.stringify(value)
    ) as Prisma.InputJsonValue;
}

export class VerificationRepository {
    async findByProjectId(projectId: string) {
        if (env.dataStore === "memory") {
            return memoryStore.reports.get(projectId);
        }

        const report =
            await prisma.verificationReport.findUnique({
                where: {
                    projectId,
                },
            });

        if (!report) {
            return undefined;
        }

        return {
            id: report.id,
            projectId: report.projectId,
            summary: report.summary,

            riskScore: fromPrismaRiskScore(
                report.riskScore
            ),

            confidenceScore: report.confidenceScore,

            verifiedEvidence: report.verifiedEvidence,
            missingEvidence: report.missingEvidence,
            inconsistencies: report.inconsistencies,

            extractedFacts:
                report.extractedFacts as unknown as
                VerificationReport["extractedFacts"],

            recommendation: report.recommendation,
            model: report.model,

            createdAt: report.createdAt.toISOString(),
            updatedAt: report.updatedAt.toISOString(),
        };
    }

    async save(report: VerificationReport) {
        if (env.dataStore === "memory") {
            const existing = memoryStore.reports.get(report.projectId);
            const savedReport = {
                ...report,
                createdAt: existing?.createdAt ?? report.createdAt,
                updatedAt: new Date().toISOString(),
            };

            memoryStore.reports.set(report.projectId, savedReport);
            return savedReport;
        }

        const savedReport =
            await prisma.verificationReport.upsert({
                where: {
                    projectId: report.projectId,
                },

                create: {
                    id: report.id,
                    projectId: report.projectId,
                    summary: report.summary,

                    riskScore: toPrismaRiskScore(
                        report.riskScore
                    ),

                    confidenceScore:
                        report.confidenceScore,

                    verifiedEvidence:
                        report.verifiedEvidence,

                    missingEvidence:
                        report.missingEvidence,

                    inconsistencies:
                        report.inconsistencies,

                    extractedFacts: toPrismaJson(
                        report.extractedFacts
                    ),

                    recommendation:
                        report.recommendation,

                    model: report.model,
                },

                update: {
                    summary: report.summary,

                    riskScore: toPrismaRiskScore(
                        report.riskScore
                    ),

                    confidenceScore:
                        report.confidenceScore,

                    verifiedEvidence:
                        report.verifiedEvidence,

                    missingEvidence:
                        report.missingEvidence,

                    inconsistencies:
                        report.inconsistencies,

                    extractedFacts: toPrismaJson(
                        report.extractedFacts
                    ),

                    recommendation:
                        report.recommendation,

                    model: report.model,
                },
            });

        return {
            id: savedReport.id,
            projectId: savedReport.projectId,
            summary: savedReport.summary,

            riskScore: fromPrismaRiskScore(
                savedReport.riskScore
            ),

            confidenceScore:
                savedReport.confidenceScore,

            verifiedEvidence:
                savedReport.verifiedEvidence,

            missingEvidence:
                savedReport.missingEvidence,

            inconsistencies:
                savedReport.inconsistencies,

            extractedFacts:
                savedReport.extractedFacts as unknown as
                VerificationReport["extractedFacts"],

            recommendation:
                savedReport.recommendation,

            model: savedReport.model,

            createdAt:
                savedReport.createdAt.toISOString(),

            updatedAt:
                savedReport.updatedAt.toISOString(),
        };
    }
}
