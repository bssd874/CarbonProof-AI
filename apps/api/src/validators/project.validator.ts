import { z } from "zod";

export const createProjectSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Project name must contain at least 3 characters"),

    location: z
        .string()
        .trim()
        .min(3, "Location must contain at least 3 characters"),

    claim: z
        .string()
        .trim()
        .min(5, "Claim must contain at least 5 characters"),

    description: z
        .string()
        .trim()
        .min(10, "Description must contain at least 10 characters"),

    ownerWallet: z.string().trim().optional(),
});