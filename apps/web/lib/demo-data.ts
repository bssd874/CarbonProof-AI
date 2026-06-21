import type {
  CarbonProject,
  Evidence,
  ProjectDetail,
  VerificationReport,
} from "@/lib/types";

const now = "2026-06-18T05:54:24.672Z";
const projectId = "demo-mangrove-restoration-bekasi";

export const demoProjects: CarbonProject[] = [
  {
    id: projectId,
    name: "Mangrove Restoration - Bekasi Coastal Area",
    location: "Bekasi Coastal Area, West Java, Indonesia",
    claim: "10,000 mangrove trees planted across a monitored coastal restoration zone.",
    description:
      "Community-led mangrove restoration with audit evidence, field imagery, sensor readings, GPS metadata, survival monitoring, and an independent auditor attestation.",
    status: "ai_reviewed",
    ownerWallet:
      "0x8d9f3c7b6a5e4d3c2b1a09876543210abcdef1234567890abcdef1234567890",
    createdAt: now,
    updatedAt: now,
  },
];

const proof = [
  ["demo-evidence-audit-report", "audit_report_pdf", "mangrove-audit-report-demo.pdf", "tGRNx6e9Jt60BJe8OSVUiRPnNJFe5HHj4udqDXkirPU", "0x1b730574eae0e27806ea3fe541079295e45d2ef4a71453009b6e460b20d7fba5", "Ff6qKhswbo12wCUF5u5ASKpRcNBckyDJwnDmeFW31bD9"],
  ["demo-evidence-drone-image", "drone_image", "mangrove-drone-image-demo.png", "Mlr4NuzOJYCiPaeqXZ52YPUmeCBjnOgoS30mr7OTwDo", "0x1eabce5377b9b8e19f313c1c9a0af364c1fa721832e1cd5861847f425b5f25e5", "91dBqyu3kGrvoSjbV1QphFX66V41ocpWMvo5Wf8wyBeY"],
  ["demo-evidence-sensor-csv", "sensor_csv", "sensor-data.csv", "KZ5cxtn5F7sHPtY3Yh3iFJgNw7wE0l6u5P6PcJrQ9cA", "0x07c26c72dd50d97beea6f5bcf422682cb5d98cf754f882c7553b1e15ef862abe", "7mSxXr3fWqNw6ZbKfAf2bCkHnU1tLxVrqJdA8QwzTpm"],
  ["demo-evidence-gps-json", "gps_metadata_json", "gps-evidence.json", "AlBvUya7BMYTbVJ7v6HdkEbK0kQm94srK_Drew-u9rk", "0x6bab0d479b5dfefeb56addeb21f509a3d066fa7ac30f22ca35de35de7d12d28e", "GpennkqGqGpF4Z27CpANbpHQmuPSzPpKMPSM34Wqpzyr"],
  ["demo-evidence-survival-rate", "survival_rate_report", "mangrove-survival-rate-report-demo.pdf", "SUrv1valRateBekasiCoast2026WalrusBlob9nQe", "0x9666dfc80f61c7c8d43cb7f2a2b6c8ac056f46c7d675963c61c5ddbf5057aab0", "Cn4o8BuwruQwBQecHmDwxV1LzgNY5BR2gLq9xRXdQ1k"],
  ["demo-evidence-auditor-signature", "auditor_signature", "auditor-attestation-demo.pdf", "Aud1torAttestationBekasiWalrusBlob4bF9zUcA", "0x20b4e7b781e49e4cb130278dc8eca6d35ed25d8392f21d1b9f18cf06327ff1fa", "B1q8amzwsQoWjDyTj8VPC15et8QSLrRJaD5Vj43JHTs"],
] as const;

export const demoEvidence: Evidence[] = proof.map(
  ([id, evidenceType, fileName, walrusBlobId, suiObjectId, transactionDigest], index) => ({
    id,
    projectId,
    evidenceType,
    fileName,
    originalName: fileName,
    mimeType: fileName.endsWith(".png")
      ? "image/png"
      : fileName.endsWith(".csv")
        ? "text/csv"
        : fileName.endsWith(".json")
          ? "application/json"
          : "application/pdf",
    fileSize: 128_000 + index * 47_000,
    storagePath: `/demo/${fileName}`,
    evidenceHash: `${String(index + 1).repeat(8)}9f73b1a8e4c1d0a9a7c5e2f8b6d4c3a1`,
    walrusBlobId,
    walrusObjectId: `0x${String(index + 2).repeat(64)}`,
    suiObjectId,
    transactionDigest,
    uploadedBy: demoProjects[0].ownerWallet,
    createdAt: now,
  }),
);

export const demoVerificationReport: VerificationReport = {
  id: "demo-verification-mangrove-bekasi",
  projectId,
  summary:
    "The evidence package supports the planting claim and includes complete Walrus and Sui proof metadata. One additional seasonal survival observation is recommended before final certification.",
  riskScore: "Medium",
  confidenceScore: 82,
  verifiedEvidence: demoEvidence.map((item) => item.originalName),
  missingEvidence: ["Independent seasonal field observation"],
  inconsistencies: [],
  extractedFacts: [
    {
      field: "trees_planted",
      value: "10,000",
      sourceEvidenceId: "demo-evidence-audit-report",
      confidence: 89,
    },
    {
      field: "project_location",
      value: "Bekasi Coastal Area, West Java, Indonesia",
      sourceEvidenceId: "demo-evidence-gps-json",
      confidence: 93,
    },
  ],
  recommendation:
    "Approve as a provisional verified impact credit and request certified auditor approval before production issuance.",
  model: "carbonproof-demo-risk-engine",
  createdAt: now,
};

export const demoProjectDetail: ProjectDetail = {
  ...demoProjects[0],
  evidences: demoEvidence,
  verificationReport: demoVerificationReport,
};
