import fs from "node:fs/promises";
import { GoogleGenAI } from "@google/genai";

import { env } from "../config/env";
import { CarbonProject } from "../types/project.types";
import { Evidence } from "../types/evidence.types";
import { AppError } from "../utils/app-error";
import {
    AiRiskReport,
    aiRiskReportSchema,
} from "../validators/verification.validator";

type GeminiTextPart = {
    text: string;
};

type GeminiInlineDataPart = {
    inlineData: {
        mimeType: string;
        data: string;
    };
};

type GeminiPart =
    | GeminiTextPart
    | GeminiInlineDataPart;

/**
 * JSON Schema yang diwajibkan untuk response Gemini.
 *
 * Hasil Gemini tetap divalidasi ulang menggunakan Zod
 * setelah JSON diterima.
 */
const riskReportJsonSchema = {
    type: "object",

    properties: {
        summary: {
            type: "string",
            description:
                "Concise summary of the evidence review and how well it supports the project claim.",
        },

        riskScore: {
            type: "string",
            enum: ["Low", "Medium", "High"],
            description:
                "Overall evidence risk level. Low does not mean regulatory certification.",
        },

        confidenceScore: {
            type: "integer",
            minimum: 0,
            maximum: 100,
            description:
                "Confidence in this automated evidence review, between 0 and 100.",
        },

        verifiedEvidence: {
            type: "array",
            description:
                "List of evidence or claims that are supported by the uploaded files.",

            items: {
                type: "string",
            },
        },

        missingEvidence: {
            type: "array",
            description:
                "Important evidence that is missing and should be requested.",

            items: {
                type: "string",
            },
        },

        inconsistencies: {
            type: "array",
            description:
                "Contradictions, suspicious values, unsupported claims, or inconsistencies found across evidence.",

            items: {
                type: "string",
            },
        },

        extractedFacts: {
            type: "array",
            description:
                "Important facts extracted from the uploaded evidence.",

            items: {
                type: "object",

                properties: {
                    field: {
                        type: "string",
                        description:
                            "Machine-readable fact name, such as planted_tree_count.",
                    },

                    value: {
                        type: "string",
                        description:
                            "Value extracted from the evidence.",
                    },

                    sourceEvidenceId: {
                        type: "string",
                        description:
                            "ID of the evidence that supports this fact.",
                    },

                    confidence: {
                        type: "number",
                        minimum: 0,
                        maximum: 100,
                        description:
                            "Confidence in the extracted fact.",
                    },
                },

                required: [
                    "field",
                    "value",
                    "sourceEvidenceId",
                    "confidence",
                ],
            },
        },

        recommendation: {
            type: "string",
            description:
                "Recommended next action for the project owner or auditor.",
        },
    },

    required: [
        "summary",
        "riskScore",
        "confidenceScore",
        "verifiedEvidence",
        "missingEvidence",
        "inconsistencies",
        "extractedFacts",
        "recommendation",
    ],
} as const;

export class AiVerifierService {
    private ai?: GoogleGenAI;

    async verify(
        project: CarbonProject,
        evidences: Evidence[]
    ): Promise<AiRiskReport> {
        if (evidences.length === 0) {
            throw new Error(
                "Project has no evidence to verify"
            );
        }

        if (env.aiProvider === "mock") {
            return this.buildMockRiskReport(
                project,
                evidences
            );
        }

        const parts: GeminiPart[] = [
            {
                text: this.buildPrompt(
                    project,
                    evidences
                ),
            },
        ];

        /*
         * Sisakan ruang untuk prompt dan response.
         * File yang terlalu besar tidak dimasukkan secara inline.
         */
        const maximumInlineBytes =
            15 * 1024 * 1024;

        let totalInlineBytes = 0;

        for (const evidence of evidences) {
            const evidenceParts =
                await this.createEvidenceParts(
                    evidence,
                    totalInlineBytes,
                    maximumInlineBytes
                );

            parts.push(...evidenceParts.parts);

            totalInlineBytes +=
                evidenceParts.includedBytes;
        }

        const ai = this.getGeminiClient();

        const response =
            await ai.models.generateContent({
                model: env.geminiModel,

                contents: [
                    {
                        role: "user",
                        parts,
                    },
                ],

                config: {
                    temperature: 0.1,

                    responseMimeType: "application/json",
                    responseSchema: riskReportJsonSchema,
                },
            });

        const responseText = response.text;

        if (!responseText) {
            throw new Error(
                "Gemini returned an empty response"
            );
        }

        let parsedResponse: unknown;

        try {
            parsedResponse = JSON.parse(responseText);
        } catch {
            throw new Error(
                "Gemini returned invalid JSON"
            );
        }

        /*
         * Jangan percaya output AI secara langsung.
         * Zod memastikan semua field dan tipe datanya valid.
         */
        return aiRiskReportSchema.parse(
            parsedResponse
        );
    }

    private async createEvidenceParts(
        evidence: Evidence,
        currentInlineBytes: number,
        maximumInlineBytes: number
    ): Promise<{
        parts: GeminiPart[];
        includedBytes: number;
    }> {
        const metadataPart: GeminiTextPart = {
            text: this.buildEvidenceMetadata(
                evidence
            ),
        };

        let fileBuffer: Buffer;

        try {
            fileBuffer = await fs.readFile(
                evidence.storagePath
            );
        } catch {
            return {
                parts: [
                    metadataPart,
                    {
                        text:
                            `The physical file for evidence ${evidence.id} ` +
                            "could not be read. Analyze its metadata only.",
                    },
                ],

                includedBytes: 0,
            };
        }

        const wouldExceedInlineLimit =
            currentInlineBytes +
            fileBuffer.length >
            maximumInlineBytes;

        if (wouldExceedInlineLimit) {
            return {
                parts: [
                    metadataPart,
                    {
                        text:
                            `Evidence ${evidence.id} was not attached because ` +
                            "the combined inline file-size limit was reached. " +
                            "Analyze its metadata only.",
                    },
                ],

                includedBytes: 0,
            };
        }

        if (
            evidence.mimeType.startsWith("image/") ||
            evidence.mimeType ===
            "application/pdf"
        ) {
            return {
                parts: [
                    metadataPart,

                    {
                        inlineData: {
                            mimeType: evidence.mimeType,
                            data: fileBuffer.toString(
                                "base64"
                            ),
                        },
                    },

                    {
                        text:
                            `The preceding file belongs to evidence ID ${evidence.id}.`,
                    },
                ],

                includedBytes: fileBuffer.length,
            };
        }

        if (
            evidence.mimeType ===
            "application/json" ||
            evidence.mimeType ===
            "text/plain" ||
            evidence.mimeType === "text/csv" ||
            evidence.mimeType ===
            "application/csv" ||
            evidence.mimeType.includes("csv")
        ) {
            const textContent = fileBuffer
                .toString("utf8")
                .slice(0, 100_000);

            return {
                parts: [
                    metadataPart,

                    {
                        text:
                            `CONTENT OF EVIDENCE ${evidence.id}\n\n` +
                            textContent,
                    },
                ],

                includedBytes: fileBuffer.length,
            };
        }

        return {
            parts: [
                metadataPart,
                {
                    text:
                        `The content of evidence ${evidence.id} was not attached ` +
                        `because its MIME type "${evidence.mimeType}" is not supported ` +
                        "by the current verifier. Analyze its metadata only.",
                },
            ],

            includedBytes: 0,
        };
    }

    private buildEvidenceMetadata(
        evidence: Evidence
    ): string {
        return `
EVIDENCE METADATA

Evidence ID: ${evidence.id}
Evidence type: ${evidence.evidenceType}
Original file name: ${evidence.originalName}
Stored file name: ${evidence.fileName}
MIME type: ${evidence.mimeType}
File size: ${evidence.fileSize} bytes
SHA-256: ${evidence.evidenceHash}
Walrus Blob ID: ${evidence.walrusBlobId ?? "Not synced"}
Walrus Object ID: ${evidence.walrusObjectId ?? "Not synced"}
Sui Evidence Object ID: ${evidence.suiObjectId ?? "Not synced"}
Sui Transaction Digest: ${evidence.transactionDigest ?? "Not synced"}
Uploaded by: ${evidence.uploadedBy ?? "Unknown"}
Created at: ${evidence.createdAt}
`.trim();
    }

    private buildPrompt(
        project: CarbonProject,
        evidences: Evidence[]
    ): string {
        const evidenceSummary = evidences
            .map(
                (evidence) =>
                    [
                        `- Evidence ID: ${evidence.id}`,
                        `  Type: ${evidence.evidenceType}`,
                        `  File: ${evidence.originalName}`,
                        `  MIME: ${evidence.mimeType}`,
                        `  SHA-256: ${evidence.evidenceHash}`,
                        `  Walrus Blob ID: ${evidence.walrusBlobId ?? "Not synced"}`,
                        `  Walrus Object ID: ${evidence.walrusObjectId ?? "Not synced"}`,
                        `  Sui Evidence Object ID: ${evidence.suiObjectId ?? "Not synced"}`,
                        `  Sui Transaction Digest: ${evidence.transactionDigest ?? "Not synced"}`,
                    ].join("\n")
            )
            .join("\n\n");

        return `
You are CarbonProof AI, an automated evidence-review assistant for carbon and environmental-impact projects.

IMPORTANT LIMITATIONS

- You are not a certified carbon auditor.
- You must not claim regulatory approval or certification.
- You must not invent facts.
- You must clearly distinguish between verified evidence, missing evidence, and inconsistencies.
- A Low risk score means the submitted evidence appears internally consistent. It does not mean the project is officially certified.
- Only use facts that are present in the provided project data or evidence files.

PROJECT

Project ID: ${project.id}
Name: ${project.name}
Location: ${project.location}
Claim: ${project.claim}
Description: ${project.description}
Owner wallet: ${project.ownerWallet ?? "Not provided"}
Current status: ${project.status}

AVAILABLE EVIDENCE

${evidenceSummary}

REVIEW TASKS

1. Inspect every provided file and its metadata.
2. Compare evidence content with the project's stated claim.
3. Identify claims that are supported.
4. Identify missing evidence required for stronger confidence.
5. Identify contradictory numbers, dates, locations, duplicate-looking data, unsupported claims, or suspicious inconsistencies.
6. Extract important factual values from the evidence.
7. For each extracted fact, use the exact evidence ID that supports it.
8. Assign a confidence score from 0 to 100.
9. Assign:
   - Low risk when evidence is strong, internally consistent, and covers the main claim.
   - Medium risk when some evidence supports the claim but important proof is missing or uncertain.
   - High risk when evidence is weak, contradictory, unreadable, or does not support the main claim.
10. Return only the required structured JSON.
`.trim();
    }

    private getGeminiClient() {
        if (!env.geminiApiKey) {
            throw new AppError(
                "GEMINI_API_KEY is not configured",
                503
            );
        }

        if (!this.ai) {
            this.ai = new GoogleGenAI({
                apiKey: env.geminiApiKey,
            });
        }

        return this.ai;
    }

    private buildMockRiskReport(
        project: CarbonProject,
        evidences: Evidence[]
    ): AiRiskReport {
        const evidenceTypes = new Set(
            evidences.map(
                (evidence) => evidence.evidenceType
            )
        );

        const requiredEvidence = [
            {
                type: "audit_report_pdf",
                label: "Third-party audit report PDF",
            },
            {
                type: "drone_image",
                label: "Drone image evidence",
            },
            {
                type: "sensor_csv",
                label: "Sensor CSV measurements",
            },
            {
                type: "gps_metadata_json",
                label: "GPS metadata JSON",
            },
        ];

        const missingEvidence = requiredEvidence
            .filter(
                (requirement) =>
                    !evidenceTypes.has(
                        requirement.type as Evidence["evidenceType"]
                    )
            )
            .map(
                (requirement) => requirement.label
            );

        const syncedProofCount = evidences.filter(
            (evidence) =>
                evidence.walrusBlobId &&
                evidence.suiObjectId &&
                evidence.transactionDigest
        ).length;

        const riskScore =
            missingEvidence.length === 0 &&
            syncedProofCount === evidences.length
                ? "Low"
                : missingEvidence.length <= 2
                  ? "Medium"
                  : "High";

        const confidenceScore = Math.max(
            45,
            Math.min(
                92,
                60 +
                    evidences.length * 8 +
                    syncedProofCount * 4 -
                    missingEvidence.length * 10
            )
        );

        const firstEvidence = evidences[0];

        return {
            summary:
                `${project.name} has ${evidences.length} evidence file(s) ` +
                `supporting the claim "${project.claim}". ` +
                `${syncedProofCount} evidence record(s) include Walrus and Sui proof metadata.`,

            riskScore,
            confidenceScore,

            verifiedEvidence: evidences.map(
                (evidence) =>
                    `${evidence.evidenceType} uploaded as ${evidence.originalName} with SHA-256 ${evidence.evidenceHash}`
            ),

            missingEvidence,

            inconsistencies:
                missingEvidence.length === 0
                    ? []
                    : [
                          "Some expected demo evidence types are not attached yet.",
                      ],

            extractedFacts: [
                {
                    field: "project_location",
                    value: project.location,
                    sourceEvidenceId:
                        firstEvidence.id,
                    confidence: 85,
                },
                {
                    field: "evidence_count",
                    value: String(evidences.length),
                    sourceEvidenceId:
                        firstEvidence.id,
                    confidence: 95,
                },
                {
                    field: "synced_proof_count",
                    value: String(syncedProofCount),
                    sourceEvidenceId:
                        firstEvidence.id,
                    confidence: 90,
                },
            ],

            recommendation:
                missingEvidence.length === 0
                    ? "Evidence package is demo-ready. Proceed to auditor review and impact credit issuance."
                    : "Upload the missing evidence types and sync each Walrus/Sui proof before issuing impact credits.",
        };
    }
}
