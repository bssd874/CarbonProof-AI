import { z } from "zod";

export const addEvidenceSchema = z.object({
    evidenceType: z.enum([
        "audit_report_pdf",
        "drone_image",
        "sensor_csv",
        "gps_metadata_json",
        "survival_rate_report",
        "auditor_signature",
    ]),

    fileName: z
        .string()
        .trim()
        .min(1, "File name is required"),

    uploadedBy: z.string().trim().optional(),
});