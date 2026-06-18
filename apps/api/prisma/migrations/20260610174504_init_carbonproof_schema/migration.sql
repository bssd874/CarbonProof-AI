-- CreateEnum
CREATE TYPE "CarbonProjectStatus" AS ENUM ('DRAFT', 'PENDING_EVIDENCE', 'AI_REVIEWED', 'VERIFIED', 'CREDIT_ISSUED');

-- CreateEnum
CREATE TYPE "EvidenceType" AS ENUM ('AUDIT_REPORT_PDF', 'DRONE_IMAGE', 'SENSOR_CSV', 'GPS_METADATA_JSON', 'SURVIVAL_RATE_REPORT', 'AUDITOR_SIGNATURE');

-- CreateEnum
CREATE TYPE "RiskScore" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "carbon_projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "claim" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "CarbonProjectStatus" NOT NULL DEFAULT 'PENDING_EVIDENCE',
    "ownerWallet" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carbon_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidences" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "evidenceType" "EvidenceType" NOT NULL,
    "fileName" TEXT NOT NULL,
    "walrusBlobId" TEXT,
    "evidenceHash" TEXT,
    "transactionDigest" TEXT,
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evidences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_reports" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "riskScore" "RiskScore" NOT NULL,
    "verifiedEvidence" TEXT[],
    "missingEvidence" TEXT[],
    "recommendation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "evidences_projectId_idx" ON "evidences"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "verification_reports_projectId_key" ON "verification_reports"("projectId");

-- AddForeignKey
ALTER TABLE "evidences" ADD CONSTRAINT "evidences_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "carbon_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_reports" ADD CONSTRAINT "verification_reports_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "carbon_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
