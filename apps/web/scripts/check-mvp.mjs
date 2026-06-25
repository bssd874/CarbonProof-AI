const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://carbonproof-ai-api.vercel.app").replace(/\/$/, "");
const runId = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);

async function readJson(path, init) {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
    signal: AbortSignal.timeout(30_000),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.success) {
    throw new Error(`${init?.method || "GET"} ${path} failed with HTTP ${response.status}: ${payload?.message || "invalid JSON response"}`);
  }

  return payload.data;
}

function assert(value, message) {
  if (!value) throw new Error(message);
}

const health = await readJson("/api/health");
assert(["connected", "memory"].includes(health.database), "API health does not have an available data store");

const project = await readJson("/api/projects", {
  method: "POST",
  body: JSON.stringify({
    name: `MVP DoD Check - Seagrass Nusa Penida ${runId}`,
    location: "Ped, Nusa Penida, Klungkung Regency, Bali, Indonesia",
    claim: "120,000 seagrass shoots transplanted across 30 hectares",
    description:
      "Automated MVP smoke-test project for CarbonProof AI. The evidence package checks upload, SHA-256 hashing, Walrus proof metadata, Sui registry metadata, and AI verification response shape.",
    ownerWallet: "0x73c9a1e5b8426d0f4a9c37e1268b5d09f4e71a26c83b905d2f164ac8e73950bd",
  }),
});
assert(project.id, "Create project did not return an id");

const form = new FormData();
const csv = [
  "timestamp,site,water_depth_cm,temperature_c,salinity_ppt,seagrass_cover_pct",
  "2026-06-01T08:00:00+08:00,NP-SG-01,115,28.7,33.1,42",
  "2026-06-08T08:00:00+08:00,NP-SG-01,118,28.5,33.4,48",
  "2026-06-15T08:00:00+08:00,NP-SG-01,113,28.8,33.2,53",
].join("\n");
form.append("file", new Blob([csv], { type: "text/csv" }), `mvp-seagrass-sensor-${runId}.csv`);
form.append("evidenceType", "sensor_csv");
form.append("uploadedBy", project.ownerWallet || "mvp-smoke-test");

const evidence = await readJson(`/api/projects/${project.id}/evidence`, {
  method: "POST",
  body: form,
});
assert(evidence.evidenceHash, "Upload did not return SHA-256 hash");
assert(evidence.walrusBlobId, "Upload did not return Walrus Blob ID");
assert(evidence.suiObjectId, "Upload did not return Sui Object ID");
assert(evidence.transactionDigest, "Upload did not return Sui transaction digest");

const detail = await readJson(`/api/projects/${project.id}`);
assert(detail.evidences?.length >= 1, "Project detail did not include uploaded evidence");

const report = await readJson(`/api/projects/${project.id}/verify`, {
  method: "POST",
});
assert(report.summary, "Verification report did not include summary");
assert(["Low", "Medium", "High"].includes(report.riskScore), "Verification report did not include a valid risk score");
assert(Number.isFinite(report.confidenceScore), "Verification report did not include confidence score");
assert(Array.isArray(report.missingEvidence), "Verification report did not include missing evidence array");
assert(report.recommendation, "Verification report did not include recommendation");

const storedReport = await readJson(`/api/projects/${project.id}/verification-report`);
assert(storedReport.id === report.id, "Stored verification report does not match latest report");

console.log(`API: ${API_URL}`);
console.log(`Project: ${project.id}`);
console.log(`Evidence SHA-256: ${evidence.evidenceHash}`);
console.log(`Walrus Blob ID: ${evidence.walrusBlobId}`);
console.log(`Sui Object ID: ${evidence.suiObjectId}`);
console.log(`Transaction digest: ${evidence.transactionDigest}`);
console.log(`AI risk: ${report.riskScore}; confidence=${report.confidenceScore}`);
console.log("CarbonProof MVP Definition of Done API flow passed.");
