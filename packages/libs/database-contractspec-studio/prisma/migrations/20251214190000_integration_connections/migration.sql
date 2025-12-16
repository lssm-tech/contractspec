-- CreateEnum
CREATE TYPE "lssm_sigil"."IntegrationOwnershipMode" AS ENUM ('managed', 'byok');
-- CreateEnum
CREATE TYPE "lssm_sigil"."IntegrationConnectionStatus" AS ENUM ('connected', 'disconnected', 'error', 'unknown');
-- CreateTable
CREATE TABLE "lssm_sigil"."integration_connection" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "integrationKey" TEXT NOT NULL,
    "integrationVersion" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "environment" TEXT,
    "ownershipMode" "lssm_sigil"."IntegrationOwnershipMode" NOT NULL,
    "externalAccountId" TEXT,
    "secretProvider" TEXT NOT NULL,
    "secretRef" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "status" "lssm_sigil"."IntegrationConnectionStatus" NOT NULL DEFAULT 'unknown',
    "healthStatus" "lssm_sigil"."IntegrationConnectionStatus",
    "healthCheckedAt" TIMESTAMP(3),
    "healthLatencyMs" DOUBLE PRECISION,
    "healthErrorCode" TEXT,
    "healthErrorMessage" TEXT,
    "usageRequestCount" INTEGER NOT NULL DEFAULT 0,
    "usageSuccessCount" INTEGER NOT NULL DEFAULT 0,
    "usageErrorCount" INTEGER NOT NULL DEFAULT 0,
    "usageLastUsedAt" TIMESTAMP(3),
    "usageLastSuccessAt" TIMESTAMP(3),
    "usageLastErrorAt" TIMESTAMP(3),
    "usageLastErrorCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "integration_connection_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE INDEX "integration_connection_organizationId_idx" ON "lssm_sigil"."integration_connection"("organizationId");
-- CreateIndex
CREATE INDEX "integration_connection_organizationId_integrationKey_integrationVersion_idx" ON "lssm_sigil"."integration_connection"(
    "organizationId",
    "integrationKey",
    "integrationVersion"
);
-- CreateIndex
CREATE INDEX "integration_connection_organizationId_status_idx" ON "lssm_sigil"."integration_connection"("organizationId", "status");
-- AddForeignKey
ALTER TABLE "lssm_sigil"."integration_connection"
ADD CONSTRAINT "integration_connection_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "lssm_sigil"."organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;







