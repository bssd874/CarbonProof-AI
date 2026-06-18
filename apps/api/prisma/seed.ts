import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import {
    CarbonProjectStatus,
    EvidenceType,
    Prisma,
    PrismaClient,
    RiskScore,
} from "../src/generated/prisma/client";

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
}

const prisma = new PrismaClient({
    adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL,
    }),
});

const repoRoot = path.resolve(__dirname, "../../..");
const fixtureRoot = path.join(repoRoot, "file-testing");

type DemoEvidence = {
    id: string;
    evidenceType: EvidenceType;
    fileName: string;
    mimeType: string;
    walrusBlobId: string;
    walrusObjectId: string;
    suiObjectId: string;
    transactionDigest: string;
};

const projectId = "demo-mangrove-restoration-bekasi";

const demoEvidence: DemoEvidence[] = [
    {
        id: "demo-evidence-audit-report",
        evidenceType: EvidenceType.AUDIT_REPORT_PDF,
        fileName: "mangrove-audit-report-demo.pdf",
        mimeType: "application/pdf",
        walrusBlobId:
            "tGRNx6e9Jt60BJe8OSVUiRPnNJFe5HHj4udqDXkirPU",
        walrusObjectId:
            "0xfcad438a6d9b4b39c3dff327fa1b3b596664e7564abd745cc81594fdbe2fc138",
        suiObjectId:
            "0x1b730574eae0e27806ea3fe541079295e45d2ef4a71453009b6e460b20d7fba5",
        transactionDigest:
            "Ff6qKhswbo12wCUF5u5ASKpRcNBckyDJwnDmeFW31bD9",
    },
    {
        id: "demo-evidence-drone-image",
        evidenceType: EvidenceType.DRONE_IMAGE,
        fileName: "mangrove-drone-image-demo.png",
        mimeType: "image/png",
        walrusBlobId:
            "Mlr4NuzOJYCiPaeqXZ52YPUmeCBjnOgoS30mr7OTwDo",
        walrusObjectId:
            "0xd72e2f8019a32cad318836949dc1fd4703288ab8b843426a96e0c7da0b9a074a",
        suiObjectId:
            "0x1eabce5377b9b8e19f313c1c9a0af364c1fa721832e1cd5861847f425b5f25e5",
        transactionDigest:
            "91dBqyu3kGrvoSjbV1QphFX66V41ocpWMvo5Wf8wyBeY",
    },
    {
        id: "demo-evidence-sensor-csv",
        evidenceType: EvidenceType.SENSOR_CSV,
        fileName: "sensor-data.csv",
        mimeType: "text/csv",
        walrusBlobId:
            "KZ5cxtn5F7sHPtY3Yh3iFJgNw7wE0l6u5P6PcJrQ9cA",
        walrusObjectId:
            "0x8c415f8d6f702eb55b5348dbb3d5f1b21b60a7ee7ed52f96c850692f4f3fda11",
        suiObjectId:
            "0x07c26c72dd50d97beea6f5bcf422682cb5d98cf754f882c7553b1e15ef862abe",
        transactionDigest:
            "7mSxXr3fWqNw6ZbKfAf2bCkHnU1tLxVrqJdA8QwzTpm",
    },
    {
        id: "demo-evidence-gps-json",
        evidenceType: EvidenceType.GPS_METADATA_JSON,
        fileName: "gps-evidence.json",
        mimeType: "application/json",
        walrusBlobId:
            "AlBvUya7BMYTbVJ7v6HdkEbK0kQm94srK_Drew-u9rk",
        walrusObjectId:
            "0x2c45b171cf1d59b8881c8c3cb0ac7e692ba321a6c76c199fb86bd1a44955feb9",
        suiObjectId:
            "0x6bab0d479b5dfefeb56addeb21f509a3d066fa7ac30f22ca35de35de7d12d28e",
        transactionDigest:
            "GpennkqGqGpF4Z27CpANbpHQmuPSzPpKMPSM34Wqpzyr",
    },
    {
        id: "demo-evidence-survival-rate",
        evidenceType: EvidenceType.SURVIVAL_RATE_REPORT,
        fileName: "mangrove-survival-rate-report-demo.pdf",
        mimeType: "application/pdf",
        walrusBlobId:
            "SUrv1valRateBekasiCoast2026WalrusBlob9nQe",
        walrusObjectId:
            "0x0bb95ff91f62e67b9318e1ebf2d4fbef978d4b6af91b4321d548242a87eb6a34",
        suiObjectId:
            "0x9666dfc80f61c7c8d43cb7f2a2b6c8ac056f46c7d675963c61c5ddbf5057aab0",
        transactionDigest:
            "Cn4o8BuwruQwBQecHmDwxV1LzgNY5BR2gLq9xRXdQ1k",
    },
    {
        id: "demo-evidence-auditor-signature",
        evidenceType: EvidenceType.AUDITOR_SIGNATURE,
        fileName: "auditor-attestation-demo.pdf",
        mimeType: "application/pdf",
        walrusBlobId:
            "Aud1torAttestationBekasiWalrusBlob4bF9zUcA",
        walrusObjectId:
            "0xaa3e252f14c58a8ad59b03c7174ba5936e5c8f6bbd20365838d04aef5670d777",
        suiObjectId:
            "0x20b4e7b781e49e4cb130278dc8eca6d35ed25d8392f21d1b9f18cf06327ff1fa",
        transactionDigest:
            "B1q8amzwsQoWjDyTj8VPC15et8QSLrRJaD5Vj43JHTs",
    },
];

async function main() {
    await prisma.carbonProject.upsert({
        where: {
            id: projectId,
        },
        update: {
            name: "Mangrove Restoration - Bekasi Coastal Area",
            location: "Bekasi Coastal Area, West Java, Indonesia",
            claim:
                "Restored 50 hectares of mangrove habitat with monitored survival rate and carbon-impact evidence.",
            description:
                "Demo project for CarbonProof AI showing evidence upload, Walrus storage references, Sui registry proof, and AI risk scoring.",
            status: CarbonProjectStatus.AI_REVIEWED,
            ownerWallet:
                "0x8d9f3c7b6a5e4d3c2b1a09876543210abcdef1234567890abcdef1234567890",
        },
        create: {
            id: projectId,
            name: "Mangrove Restoration - Bekasi Coastal Area",
            location: "Bekasi Coastal Area, West Java, Indonesia",
            claim:
                "Restored 50 hectares of mangrove habitat with monitored survival rate and carbon-impact evidence.",
            description:
                "Demo project for CarbonProof AI showing evidence upload, Walrus storage references, Sui registry proof, and AI risk scoring.",
            status: CarbonProjectStatus.AI_REVIEWED,
            ownerWallet:
                "0x8d9f3c7b6a5e4d3c2b1a09876543210abcdef1234567890abcdef1234567890",
        },
    });

    for (const evidence of demoEvidence) {
        const storagePath = path.join(
            fixtureRoot,
            evidence.fileName
        );
        const fileBuffer = await fs.readFile(storagePath);
        const evidenceHash = createHash("sha256")
            .update(fileBuffer)
            .digest("hex");

        await prisma.evidence.upsert({
            where: {
                id: evidence.id,
            },
            update: {
                projectId,
                evidenceType: evidence.evidenceType,
                fileName: evidence.fileName,
                originalName: evidence.fileName,
                mimeType: evidence.mimeType,
                fileSize: fileBuffer.length,
                storagePath,
                evidenceHash,
                walrusBlobId: evidence.walrusBlobId,
                walrusObjectId: evidence.walrusObjectId,
                suiObjectId: evidence.suiObjectId,
                transactionDigest:
                    evidence.transactionDigest,
                uploadedBy:
                    "0x8d9f3c7b6a5e4d3c2b1a09876543210abcdef1234567890abcdef1234567890",
            },
            create: {
                id: evidence.id,
                projectId,
                evidenceType: evidence.evidenceType,
                fileName: evidence.fileName,
                originalName: evidence.fileName,
                mimeType: evidence.mimeType,
                fileSize: fileBuffer.length,
                storagePath,
                evidenceHash,
                walrusBlobId: evidence.walrusBlobId,
                walrusObjectId: evidence.walrusObjectId,
                suiObjectId: evidence.suiObjectId,
                transactionDigest:
                    evidence.transactionDigest,
                uploadedBy:
                    "0x8d9f3c7b6a5e4d3c2b1a09876543210abcdef1234567890abcdef1234567890",
            },
        });
    }

    await prisma.verificationReport.upsert({
        where: {
            projectId,
        },
        update: buildVerificationReport(),
        create: {
            id: "demo-verification-mangrove-bekasi",
            projectId,
            ...buildVerificationReport(),
        },
    });

    console.log(
        `Seeded demo project ${projectId} with ${demoEvidence.length} evidence records.`
    );
}

function buildVerificationReport() {
    return {
        summary:
            "Seeded demo report: evidence package includes audit, drone, sensor, GPS, survival-rate, and auditor-attestation files with synced Walrus/Sui proof metadata.",
        riskScore: RiskScore.LOW,
        confidenceScore: 91,
        verifiedEvidence: demoEvidence.map(
            (evidence) =>
                `${evidence.evidenceType} synced via ${evidence.walrusBlobId}`
        ),
        missingEvidence: [],
        inconsistencies: [],
        extractedFacts: [
            {
                field: "restoration_area_hectares",
                value: "50",
                sourceEvidenceId:
                    "demo-evidence-audit-report",
                confidence: 86,
            },
            {
                field: "project_location",
                value:
                    "Bekasi Coastal Area, West Java, Indonesia",
                sourceEvidenceId: "demo-evidence-gps-json",
                confidence: 93,
            },
            {
                field: "proof_records_synced",
                value: String(demoEvidence.length),
                sourceEvidenceId: "demo-evidence-gps-json",
                confidence: 95,
            },
        ] satisfies Prisma.InputJsonValue,
        recommendation:
            "Demo evidence is complete enough for AI review and impact credit issuance flow. Request certified auditor approval before production credit issuance.",
        model: "seeded-demo-risk-engine",
    };
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
