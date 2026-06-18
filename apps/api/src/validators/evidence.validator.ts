import { z } from "zod";

const optionalProofString = z
    .string()
    .trim()
    .min(1)
    .optional();

export const addEvidenceSchema = z.object({
    evidenceType: z.enum([
        "audit_report_pdf",
        "drone_image",
        "sensor_csv",
        "gps_metadata_json",
        "survival_rate_report",
        "auditor_signature",
    ]),

    uploadedBy: z
        .string()
        .trim()
        .optional(),

    walrusBlobId: optionalProofString,
    walrusObjectId: optionalProofString,
    suiObjectId: optionalProofString,
    transactionDigest: optionalProofString,
});

export const syncEvidenceProofSchema = z
    .object({
        walrusBlobId: optionalProofString,
        walrusObjectId: optionalProofString,
        suiObjectId: optionalProofString,
        transactionDigest: optionalProofString,
    })
    .refine(
        (value) =>
            Boolean(
                value.walrusBlobId ||
                    value.walrusObjectId ||
                    value.suiObjectId ||
                    value.transactionDigest
            ),
        {
            message:
                "At least one proof metadata field is required",
        }
    );
