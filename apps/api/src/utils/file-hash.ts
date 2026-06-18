import fs from "node:fs/promises";
import { createHash } from "node:crypto";

export async function calculateSha256(
    filePath: string
): Promise<string> {
    const fileBuffer = await fs.readFile(filePath);

    return createHash("sha256")
        .update(fileBuffer)
        .digest("hex");
}