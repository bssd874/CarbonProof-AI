import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import multer from "multer";
import { env } from "../config/env";

const uploadDirectory = process.env.VERCEL
    ? path.join(os.tmpdir(), "carbonproof-ai", "uploads")
    : path.resolve(process.cwd(), "uploads");

fs.mkdirSync(uploadDirectory, {
    recursive: true,
});

const allowedMimeTypes = new Set([
    "application/pdf",
    "image/jpeg",
    "image/png",
    "text/csv",
    "application/csv",
    "application/json",
    "text/plain",
]);

const storage = multer.diskStorage({
    destination: (_req, _file, callback) => {
        callback(null, uploadDirectory);
    },

    filename: (_req, file, callback) => {
        const extension = path.extname(
            file.originalname
        );

        callback(
            null,
            `${randomUUID()}${extension.toLowerCase()}`
        );
    },
});

export const uploadEvidenceFile = multer({
    storage,

    limits: {
        fileSize:
            env.uploadMaxSizeMb * 1024 * 1024,
    },

    fileFilter: (_req, file, callback) => {
        if (!allowedMimeTypes.has(file.mimetype)) {
            callback(
                new Error(
                    `Unsupported file type: ${file.mimetype}`
                )
            );

            return;
        }

        callback(null, true);
    },
});
