-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "lssm_learning";
-- CreateEnum
CREATE TYPE "lssm_learning"."OnboardingStepStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED');
-- CreateTable
CREATE TABLE "lssm_learning"."learner" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "learner_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "lssm_learning"."onboarding_track" (
    "id" TEXT NOT NULL,
    "trackKey" TEXT NOT NULL,
    "productId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "targetUserSegment" TEXT,
    "targetRole" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "canSkip" BOOLEAN NOT NULL DEFAULT true,
    "totalXp" INTEGER,
    "completionXpBonus" INTEGER,
    "completionBadgeKey" TEXT,
    "streakHoursWindow" INTEGER,
    "streakBonusXp" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "onboarding_track_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "lssm_learning"."onboarding_step" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "stepKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "instructions" TEXT,
    "helpUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "completionEvent" TEXT NOT NULL,
    "completionCondition" JSONB,
    "availability" JSONB,
    "xpReward" INTEGER DEFAULT 10,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "canSkip" BOOLEAN NOT NULL DEFAULT true,
    "actionUrl" TEXT,
    "actionLabel" TEXT,
    "highlightSelector" TEXT,
    "tooltipPosition" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "onboarding_step_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "lssm_learning"."onboarding_progress" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "lastActivityAt" TIMESTAMP(3),
    "isDismissed" BOOLEAN NOT NULL DEFAULT false,
    "dismissedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "onboarding_progress_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "lssm_learning"."onboarding_step_completion" (
    "id" TEXT NOT NULL,
    "progressId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "status" "lssm_learning"."OnboardingStepStatus" NOT NULL,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "triggeringEvent" TEXT,
    "eventPayload" JSONB,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "onboarding_step_completion_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE UNIQUE INDEX "learner_userId_organizationId_key" ON "lssm_learning"."learner"("userId", "organizationId");
-- CreateIndex
CREATE INDEX "learner_organizationId_idx" ON "lssm_learning"."learner"("organizationId");
-- CreateIndex
CREATE INDEX "learner_userId_idx" ON "lssm_learning"."learner"("userId");
-- CreateIndex
CREATE UNIQUE INDEX "onboarding_track_trackKey_key" ON "lssm_learning"."onboarding_track"("trackKey");
-- CreateIndex
CREATE INDEX "onboarding_track_productId_isActive_idx" ON "lssm_learning"."onboarding_track"("productId", "isActive");
-- CreateIndex
CREATE UNIQUE INDEX "onboarding_step_trackId_stepKey_key" ON "lssm_learning"."onboarding_step"("trackId", "stepKey");
-- CreateIndex
CREATE INDEX "onboarding_step_trackId_order_idx" ON "lssm_learning"."onboarding_step"("trackId", "order");
-- CreateIndex
CREATE INDEX "onboarding_step_completionEvent_idx" ON "lssm_learning"."onboarding_step"("completionEvent");
-- CreateIndex
CREATE UNIQUE INDEX "onboarding_progress_learnerId_trackId_key" ON "lssm_learning"."onboarding_progress"("learnerId", "trackId");
-- CreateIndex
CREATE INDEX "onboarding_progress_learnerId_isCompleted_idx" ON "lssm_learning"."onboarding_progress"("learnerId", "isCompleted");
-- CreateIndex
CREATE INDEX "onboarding_progress_trackId_idx" ON "lssm_learning"."onboarding_progress"("trackId");
-- CreateIndex
CREATE UNIQUE INDEX "onboarding_step_completion_progressId_stepId_key" ON "lssm_learning"."onboarding_step_completion"("progressId", "stepId");
-- CreateIndex
CREATE INDEX "onboarding_step_completion_completedAt_idx" ON "lssm_learning"."onboarding_step_completion"("completedAt");
-- AddForeignKey
ALTER TABLE "lssm_learning"."learner"
ADD CONSTRAINT "learner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "lssm_sigil"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "lssm_learning"."learner"
ADD CONSTRAINT "learner_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "lssm_sigil"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "lssm_learning"."onboarding_step"
ADD CONSTRAINT "onboarding_step_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "lssm_learning"."onboarding_track"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "lssm_learning"."onboarding_progress"
ADD CONSTRAINT "onboarding_progress_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "lssm_learning"."learner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "lssm_learning"."onboarding_progress"
ADD CONSTRAINT "onboarding_progress_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "lssm_learning"."onboarding_track"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "lssm_learning"."onboarding_step_completion"
ADD CONSTRAINT "onboarding_step_completion_progressId_fkey" FOREIGN KEY ("progressId") REFERENCES "lssm_learning"."onboarding_progress"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "lssm_learning"."onboarding_step_completion"
ADD CONSTRAINT "onboarding_step_completion_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "lssm_learning"."onboarding_step"("id") ON DELETE CASCADE ON UPDATE CASCADE;







