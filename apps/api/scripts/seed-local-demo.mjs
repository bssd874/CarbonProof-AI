import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const API_URL = (process.env.LOCAL_API_URL || "http://127.0.0.1:4000").replace(/\/$/, "");
const evidenceDirectory = resolve(process.cwd(), "../../output/evidence/peatland-restoration-pulang-pisau");

async function request(path, init) {
    const response = await fetch(`${API_URL}${path}`, {
        ...init,
        signal: AbortSignal.timeout(30_000),
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok || !payload?.success) {
        throw new Error(`${path} failed with HTTP ${response.status}: ${payload?.message || "invalid response"}`);
    }

    return payload.data;
}

const project = await request("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        name: "Peatland Restoration - Pulang Pisau Demo",
        location: "Pulang Pisau, Central Kalimantan, Indonesia",
        claim: "250 hectares of degraded peatland restored",
        description: "Local hackathon demo project for evidence upload, proof metadata, and AI verification.",
        ownerWallet: "0x8b712f34c91e6a2058d7f3bc491aee726b18cd0d940ef64c382a9175d631a482",
    }),
});

const evidenceFiles = [
    ["peatland-audit-report-2026.pdf", "audit_report_pdf", "application/pdf"],
    ["drone-survey-block-a-2026.jpg", "drone_image", "image/jpeg"],
    ["water-level-sensors-q2-2026.csv", "sensor_csv", "text/csv"],
    ["restoration-boundary-gps.json", "gps_metadata_json", "application/json"],
    ["vegetation-survival-rate-q2-2026.pdf", "survival_rate_report", "application/pdf"],
    ["auditor-attestation-2026.pdf", "auditor_signature", "application/pdf"],
];

for (const [fileName, evidenceType, mimeType] of evidenceFiles) {
    const bytes = await readFile(resolve(evidenceDirectory, fileName));
    const form = new FormData();
    form.append("file", new Blob([bytes], { type: mimeType }), fileName);
    form.append("evidenceType", evidenceType);
    form.append("uploadedBy", "local-demo");

    await request(`/api/projects/${project.id}/evidence`, {
        method: "POST",
        body: form,
    });
    console.log(`Uploaded ${evidenceType}: ${fileName}`);
}

const report = await request(`/api/projects/${project.id}/verify`, { method: "POST" });

console.log(`Project ID: ${project.id}`);
console.log(`Risk: ${report.riskScore}; confidence=${report.confidenceScore}`);
console.log(`Frontend: http://192.168.1.11:3000/projects/${project.id}`);
