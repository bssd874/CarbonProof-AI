/*
  Warnings:

  - Added the required column `fileSize` to the `evidences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimeType` to the `evidences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalName` to the `evidences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storagePath` to the `evidences` table without a default value. This is not possible if the table is not empty.
  - Made the column `evidenceHash` on table `evidences` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `confidenceScore` to the `verification_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `extractedFacts` to the `verification_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model` to the `verification_reports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "evidences" ADD COLUMN     "fileSize" INTEGER NOT NULL,
ADD COLUMN     "mimeType" TEXT NOT NULL,
ADD COLUMN     "originalName" TEXT NOT NULL,
ADD COLUMN     "storagePath" TEXT NOT NULL,
ALTER COLUMN "evidenceHash" SET NOT NULL;

-- AlterTable
ALTER TABLE "verification_reports" ADD COLUMN     "confidenceScore" INTEGER NOT NULL,
ADD COLUMN     "extractedFacts" JSONB NOT NULL,
ADD COLUMN     "inconsistencies" TEXT[],
ADD COLUMN     "model" TEXT NOT NULL;
