import { z } from "zod";

export const aiRiskReportSchema = z.object({
    summary: z.string().min(1),

    riskScore: z.enum([
        "Low",
        "Medium",
        "High",
    ]),

    confidenceScore: z
        .number()
        .int()
        .min(0)
        .max(100),

    verifiedEvidence: z.array(z.string()),
    missingEvidence: z.array(z.string()),
    inconsistencies: z.array(z.string()),

    extractedFacts: z.array(
        z.object({
            field: z.string(),
            value: z.string(),
            sourceEvidenceId: z.string(),
            confidence: z
                .number()
                .min(0)
                .max(100),
        })
    ),

    recommendation: z.string().min(1),
});

export type AiRiskReport = z.infer<
    typeof aiRiskReportSchema
>;