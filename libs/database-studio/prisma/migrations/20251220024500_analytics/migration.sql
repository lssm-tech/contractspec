-- CreateEnum
CREATE TYPE "lssm_sigil"."AgentOutcomeType" AS ENUM ('SUCCESS', 'FAILURE', 'REGENERATION', 'FEEDBACK', 'ESCALATION');

-- CreateEnum
CREATE TYPE "lssm_sigil"."AgentOutcomeSignal" AS ENUM ('POSITIVE', 'NEGATIVE', 'NEUTRAL');

-- CreateEnum
CREATE TYPE "lssm_sigil"."AgentLearningScope" AS ENUM ('GLOBAL', 'TENANT', 'USER');

-- CreateEnum
CREATE TYPE "lssm_sigil"."AgentLearningCategory" AS ENUM ('PATTERN', 'GUIDELINE', 'PREFERENCE', 'CORRECTION');

-- CreateTable
CREATE TABLE "lssm_sigil"."agent_interaction" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "tenantId" TEXT,
    "userId" TEXT,
    "input" TEXT NOT NULL,
    "inputTokens" INTEGER NOT NULL,
    "output" TEXT NOT NULL,
    "outputTokens" INTEGER NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "finishReason" TEXT NOT NULL,
    "toolCalls" JSONB NOT NULL,
    "toolResults" JSONB NOT NULL,
    "usage" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_interaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."agent_outcome" (
    "id" TEXT NOT NULL,
    "interactionId" TEXT NOT NULL,
    "outcomeType" "lssm_sigil"."AgentOutcomeType" NOT NULL,
    "signal" "lssm_sigil"."AgentOutcomeSignal" NOT NULL,
    "feedbackText" TEXT,
    "regenerationCount" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_outcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."agent_learning" (
    "id" TEXT NOT NULL,
    "scope" "lssm_sigil"."AgentLearningScope" NOT NULL,
    "scopeId" TEXT,
    "category" "lssm_sigil"."AgentLearningCategory" NOT NULL,
    "pattern" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "applicationsCount" INTEGER NOT NULL DEFAULT 0,
    "lastAppliedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_learning_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "agent_interaction_agentId_idx" ON "lssm_sigil"."agent_interaction"("agentId");

-- CreateIndex
CREATE INDEX "agent_interaction_sessionId_idx" ON "lssm_sigil"."agent_interaction"("sessionId");

-- CreateIndex
CREATE INDEX "agent_interaction_tenantId_idx" ON "lssm_sigil"."agent_interaction"("tenantId");

-- CreateIndex
CREATE INDEX "agent_interaction_userId_idx" ON "lssm_sigil"."agent_interaction"("userId");

-- CreateIndex
CREATE INDEX "agent_interaction_createdAt_idx" ON "lssm_sigil"."agent_interaction"("createdAt");

-- CreateIndex
CREATE INDEX "agent_interaction_tenantId_agentId_idx" ON "lssm_sigil"."agent_interaction"("tenantId", "agentId");

-- CreateIndex
CREATE INDEX "agent_outcome_interactionId_idx" ON "lssm_sigil"."agent_outcome"("interactionId");

-- CreateIndex
CREATE INDEX "agent_outcome_outcomeType_idx" ON "lssm_sigil"."agent_outcome"("outcomeType");

-- CreateIndex
CREATE INDEX "agent_outcome_signal_idx" ON "lssm_sigil"."agent_outcome"("signal");

-- CreateIndex
CREATE INDEX "agent_outcome_createdAt_idx" ON "lssm_sigil"."agent_outcome"("createdAt");

-- CreateIndex
CREATE INDEX "agent_learning_scope_idx" ON "lssm_sigil"."agent_learning"("scope");

-- CreateIndex
CREATE INDEX "agent_learning_scopeId_idx" ON "lssm_sigil"."agent_learning"("scopeId");

-- CreateIndex
CREATE INDEX "agent_learning_category_idx" ON "lssm_sigil"."agent_learning"("category");

-- CreateIndex
CREATE INDEX "agent_learning_confidence_idx" ON "lssm_sigil"."agent_learning"("confidence");

-- CreateIndex
CREATE INDEX "agent_learning_applicationsCount_idx" ON "lssm_sigil"."agent_learning"("applicationsCount");

-- CreateIndex
CREATE INDEX "agent_learning_scope_scopeId_idx" ON "lssm_sigil"."agent_learning"("scope", "scopeId");

-- AddForeignKey
ALTER TABLE "lssm_sigil"."agent_outcome" ADD CONSTRAINT "agent_outcome_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "lssm_sigil"."agent_interaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
