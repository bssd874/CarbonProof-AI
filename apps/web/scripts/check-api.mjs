const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://carbonproof-ai-api-git-boni-task-bssd874s-projects.vercel.app").replace(/\/$/, "");
const origin = "http://localhost:3000";

async function readJson(path) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { Origin: origin },
    signal: AbortSignal.timeout(20_000),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.success) {
    throw new Error(`${path} failed with HTTP ${response.status}: ${payload?.message || "invalid JSON response"}`);
  }
  return { response, payload };
}

const health = await readJson("/api/health");
if (!["connected", "memory"].includes(health.payload.data?.database)) {
  throw new Error("Health endpoint did not confirm an available data store");
}

const projects = await readJson("/api/projects");
if (!Array.isArray(projects.payload.data)) {
  throw new Error("Projects endpoint did not return an array");
}

const preflight = await fetch(`${API_URL}/api/projects`, {
  method: "OPTIONS",
  headers: {
    Origin: origin,
    "Access-Control-Request-Method": "POST",
    "Access-Control-Request-Headers": "content-type",
  },
  signal: AbortSignal.timeout(20_000),
});

const allowedOrigin = preflight.headers.get("access-control-allow-origin");
if (!preflight.ok || (allowedOrigin !== "*" && allowedOrigin !== origin)) {
  throw new Error(`CORS preflight failed with HTTP ${preflight.status}`);
}

console.log(`API: ${API_URL}`);
console.log(`Health: ${health.payload.data.status}; database=${health.payload.data.database}`);
console.log(`Projects: ${projects.payload.data.length}`);
console.log(`CORS: ${allowedOrigin}`);
console.log("CarbonProof frontend/backend read-only integration check passed.");
