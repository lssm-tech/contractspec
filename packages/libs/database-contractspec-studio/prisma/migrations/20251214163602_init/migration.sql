-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "lssm_sigil";

-- CreateEnum
CREATE TYPE "lssm_sigil"."EvolutionTrigger" AS ENUM ('USAGE_PATTERN', 'ANOMALY_DETECTED', 'LIFECYCLE_STAGE_CHANGE', 'MANUAL', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "lssm_sigil"."EvolutionStatus" AS ENUM ('ANALYZING', 'SUGGESTIONS_READY', 'APPLYING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "lssm_sigil"."IntegrationProvider" AS ENUM ('OPENAI', 'ANTHROPIC', 'POSTHOG', 'STRIPE', 'GITHUB', 'SLACK', 'NOTION', 'AIRTABLE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "lssm_sigil"."KnowledgeSourceType" AS ENUM ('DOCUMENTATION', 'API_SPEC', 'CODE_REPOSITORY', 'NOTION_DATABASE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "lssm_sigil"."LifecycleStage" AS ENUM ('EXPLORATION', 'PROBLEM_SOLUTION_FIT', 'MVP_EARLY_TRACTION', 'PRODUCT_MARKET_FIT', 'GROWTH_SCALE_UP', 'EXPANSION_PLATFORM', 'MATURITY_OPTIMIZATION');

-- CreateEnum
CREATE TYPE "lssm_sigil"."MilestoneStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "lssm_sigil"."OrganizationType" AS ENUM ('PLATFORM_ADMIN', 'CONTRACT_SPEC_CUSTOMER');

-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('PENDING', 'REGISTERED', 'COMPLETED', 'REWARDED');

-- CreateEnum
CREATE TYPE "ReferralRewardType" AS ENUM ('FREE_MONTH', 'DISCOUNT_PERCENTAGE', 'DISCOUNT_AMOUNT', 'EXTENDED_TRIAL');

-- CreateEnum
CREATE TYPE "lssm_sigil"."ProjectTier" AS ENUM ('STARTER', 'PROFESSIONAL', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "lssm_sigil"."DeploymentMode" AS ENUM ('SHARED', 'DEDICATED');

-- CreateEnum
CREATE TYPE "lssm_sigil"."SpecType" AS ENUM ('CAPABILITY', 'DATAVIEW', 'WORKFLOW', 'POLICY', 'COMPONENT');

-- CreateEnum
CREATE TYPE "lssm_sigil"."Environment" AS ENUM ('DEVELOPMENT', 'STAGING', 'PRODUCTION');

-- CreateEnum
CREATE TYPE "lssm_sigil"."DeploymentStatus" AS ENUM ('PENDING', 'DEPLOYING', 'DEPLOYED', 'FAILED', 'ROLLED_BACK');

-- CreateEnum
CREATE TYPE "lssm_sigil"."TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "lssm_sigil"."MessageStatus" AS ENUM ('SENT', 'DELIVERED', 'READ');

-- CreateTable
CREATE TABLE "lssm_sigil"."evolution_session" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "trigger" "lssm_sigil"."EvolutionTrigger" NOT NULL,
    "status" "lssm_sigil"."EvolutionStatus" NOT NULL,
    "signals" JSONB NOT NULL,
    "context" JSONB NOT NULL,
    "suggestions" JSONB NOT NULL,
    "appliedChanges" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "evolution_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."studio_integration" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "projectId" TEXT,
    "provider" "lssm_sigil"."IntegrationProvider" NOT NULL,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "credentials" JSONB NOT NULL,
    "config" JSONB,
    "lastUsed" TIMESTAMP(3),
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "studio_integration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."knowledge_source" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "projectId" TEXT,
    "type" "lssm_sigil"."KnowledgeSourceType" NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "content" JSONB,
    "embeddings" JSONB,
    "indexed" BOOLEAN NOT NULL DEFAULT false,
    "lastIndexed" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "knowledge_source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."lifecycle_profile" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "currentStage" "lssm_sigil"."LifecycleStage" NOT NULL,
    "detectedStage" "lssm_sigil"."LifecycleStage" NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "productPhase" TEXT,
    "companyPhase" TEXT,
    "capitalPhase" TEXT,
    "lastAssessment" TIMESTAMP(3) NOT NULL,
    "nextAssessment" TIMESTAMP(3),
    "metrics" JSONB NOT NULL,
    "signals" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lifecycle_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."lifecycle_assessment" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "stage" "lssm_sigil"."LifecycleStage" NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "focusAreas" JSONB NOT NULL,
    "signals" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lifecycle_assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."lifecycle_milestone_progress" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "milestoneId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" "lssm_sigil"."MilestoneStatus" NOT NULL,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "lifecycle_milestone_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "locale" TEXT,
    "timezone" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image" TEXT,
    "metadata" JSONB,
    "whitelistedAt" TIMESTAMP(3),
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "onboardingStep" TEXT,
    "role" TEXT DEFAULT 'user',
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "banReason" TEXT,
    "banExpires" TIMESTAMP(3),
    "phoneNumber" TEXT,
    "phoneNumberVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "impersonatedBy" TEXT,
    "activeOrganizationId" TEXT,
    "activeTeamId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "logo" TEXT,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "lssm_sigil"."OrganizationType" NOT NULL,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "onboardingStep" TEXT,
    "referralCode" TEXT,
    "referredBy" TEXT,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."member" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."invitation" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "acceptedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "inviterId" TEXT NOT NULL,
    "teamId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."team_member" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "permissions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."policy_binding" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "userId" TEXT,
    "organizationId" TEXT,

    CONSTRAINT "policy_binding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."api_key" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refillInterval" INTEGER NOT NULL,
    "refillAmount" INTEGER NOT NULL,
    "lastRefillAt" TIMESTAMP(3) NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "rateLimitEnabled" BOOLEAN NOT NULL,
    "rateLimitTimeWindow" INTEGER NOT NULL,
    "rateLimitMax" INTEGER NOT NULL,
    "requestCount" INTEGER NOT NULL,
    "remaining" INTEGER NOT NULL,
    "lastRequest" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "permissions" TEXT[],
    "metadata" JSONB,

    CONSTRAINT "api_key_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."passkey" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "credentialID" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "deviceType" TEXT NOT NULL,
    "backedUp" BOOLEAN NOT NULL,
    "transports" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aaguid" TEXT NOT NULL,

    CONSTRAINT "passkey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."sso_provider" (
    "id" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "oidcConfig" TEXT NOT NULL,
    "samlConfig" TEXT NOT NULL,
    "userId" TEXT,
    "providerId" TEXT NOT NULL,
    "organizationId" TEXT,

    CONSTRAINT "sso_provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."oauth_application" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "clientSecret" TEXT,
    "name" TEXT NOT NULL,
    "redirectURLs" TEXT[],
    "metadata" JSONB,
    "type" TEXT NOT NULL,
    "disabled" BOOLEAN NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oauth_application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."oauth_access_token" (
    "id" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "accessTokenExpiresAt" TIMESTAMP(3) NOT NULL,
    "refreshTokenExpiresAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scopes" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oauth_access_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."oauth_consent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "scopes" TEXT[],
    "consentGiven" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oauth_consent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referral" (
    "id" TEXT NOT NULL,
    "referrerOrganizationId" TEXT NOT NULL,
    "referredOrganizationId" TEXT,
    "referralCode" TEXT NOT NULL,
    "status" "ReferralStatus" NOT NULL DEFAULT 'PENDING',
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registeredAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "rewardedAt" TIMESTAMP(3),

    CONSTRAINT "referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referral_reward" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "referralId" TEXT NOT NULL,
    "rewardType" "ReferralRewardType" NOT NULL,
    "description" TEXT NOT NULL,
    "value" DOUBLE PRECISION,
    "months" INTEGER,
    "isApplied" BOOLEAN NOT NULL DEFAULT false,
    "appliedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "stripeCouponId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referral_reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."studio_project" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "tier" "lssm_sigil"."ProjectTier" NOT NULL DEFAULT 'STARTER',
    "deploymentMode" "lssm_sigil"."DeploymentMode" NOT NULL DEFAULT 'SHARED',
    "byokEnabled" BOOLEAN NOT NULL DEFAULT false,
    "byokConfig" JSONB,
    "evolutionEnabled" BOOLEAN NOT NULL DEFAULT true,
    "evolutionConfig" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "studio_project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."studio_project_team" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "studio_project_team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."studio_project_slug_alias" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "studio_project_slug_alias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."studio_learning_event" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "projectId" TEXT,
    "name" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "studio_learning_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."studio_spec" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "lssm_sigil"."SpecType" NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "studio_spec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."studio_overlay" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "specId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "studio_overlay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."studio_deployment" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "environment" "lssm_sigil"."Environment" NOT NULL DEFAULT 'DEVELOPMENT',
    "status" "lssm_sigil"."DeploymentStatus" NOT NULL,
    "version" TEXT NOT NULL,
    "url" TEXT,
    "infrastructureId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deployedAt" TIMESTAMP(3),

    CONSTRAINT "studio_deployment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."template_task_category" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,

    CONSTRAINT "template_task_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."template_task" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "categoryId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "priority" "lssm_sigil"."TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "dueDate" TIMESTAMP(3),
    "tags" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "template_task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."template_conversation" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT,
    "isGroup" BOOLEAN NOT NULL DEFAULT false,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastMessageId" TEXT,

    CONSTRAINT "template_conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."template_conversation_participant" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT,
    "role" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReadAt" TIMESTAMP(3),

    CONSTRAINT "template_conversation_participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."template_message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "senderName" TEXT,
    "content" TEXT NOT NULL,
    "attachments" JSONB,
    "status" "lssm_sigil"."MessageStatus" NOT NULL DEFAULT 'SENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "template_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."template_recipe_category" (
    "id" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "icon" TEXT,

    CONSTRAINT "template_recipe_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."template_recipe" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "categoryId" TEXT,
    "slugEn" TEXT NOT NULL,
    "slugFr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "descriptionEn" TEXT,
    "descriptionFr" TEXT,
    "heroImageUrl" TEXT,
    "prepTimeMinutes" INTEGER,
    "cookTimeMinutes" INTEGER,
    "servings" INTEGER,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "template_recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."template_recipe_ingredient" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "ordering" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "template_recipe_ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lssm_sigil"."template_recipe_instruction" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "contentEn" TEXT NOT NULL,
    "contentFr" TEXT NOT NULL,
    "ordering" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "template_recipe_instruction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "evolution_session_projectId_status_idx" ON "lssm_sigil"."evolution_session"("projectId", "status");

-- CreateIndex
CREATE INDEX "studio_integration_organizationId_provider_idx" ON "lssm_sigil"."studio_integration"("organizationId", "provider");

-- CreateIndex
CREATE INDEX "knowledge_source_organizationId_type_idx" ON "lssm_sigil"."knowledge_source"("organizationId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "lifecycle_profile_organizationId_key" ON "lssm_sigil"."lifecycle_profile"("organizationId");

-- CreateIndex
CREATE INDEX "lifecycle_assessment_profileId_createdAt_idx" ON "lssm_sigil"."lifecycle_assessment"("profileId", "createdAt");

-- CreateIndex
CREATE INDEX "lifecycle_milestone_progress_profileId_status_idx" ON "lssm_sigil"."lifecycle_milestone_progress"("profileId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "lssm_sigil"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_phoneNumber_key" ON "lssm_sigil"."user"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "lssm_sigil"."session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "account_accountId_providerId_key" ON "lssm_sigil"."account"("accountId", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "organization_slug_key" ON "lssm_sigil"."organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "organization_referralCode_key" ON "lssm_sigil"."organization"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "member_userId_organizationId_key" ON "lssm_sigil"."member"("userId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "lssm_sigil"."role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permission_name_key" ON "lssm_sigil"."permission"("name");

-- CreateIndex
CREATE INDEX "policy_binding_targetType_targetId_idx" ON "lssm_sigil"."policy_binding"("targetType", "targetId");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_application_clientId_key" ON "lssm_sigil"."oauth_application"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "referral_referredOrganizationId_key" ON "referral"("referredOrganizationId");

-- CreateIndex
CREATE INDEX "studio_project_organizationId_idx" ON "lssm_sigil"."studio_project"("organizationId");

-- CreateIndex
CREATE INDEX "studio_project_organizationId_deletedAt_idx" ON "lssm_sigil"."studio_project"("organizationId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "studio_project_organizationId_slug_key" ON "lssm_sigil"."studio_project"("organizationId", "slug");

-- CreateIndex
CREATE INDEX "studio_project_team_projectId_idx" ON "lssm_sigil"."studio_project_team"("projectId");

-- CreateIndex
CREATE INDEX "studio_project_team_teamId_idx" ON "lssm_sigil"."studio_project_team"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "studio_project_team_projectId_teamId_key" ON "lssm_sigil"."studio_project_team"("projectId", "teamId");

-- CreateIndex
CREATE INDEX "studio_project_slug_alias_projectId_idx" ON "lssm_sigil"."studio_project_slug_alias"("projectId");

-- CreateIndex
CREATE INDEX "studio_project_slug_alias_organizationId_idx" ON "lssm_sigil"."studio_project_slug_alias"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "studio_project_slug_alias_organizationId_slug_key" ON "lssm_sigil"."studio_project_slug_alias"("organizationId", "slug");

-- CreateIndex
CREATE INDEX "studio_learning_event_organizationId_idx" ON "lssm_sigil"."studio_learning_event"("organizationId");

-- CreateIndex
CREATE INDEX "studio_learning_event_projectId_idx" ON "lssm_sigil"."studio_learning_event"("projectId");

-- CreateIndex
CREATE INDEX "studio_learning_event_organizationId_createdAt_idx" ON "lssm_sigil"."studio_learning_event"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "studio_spec_projectId_type_idx" ON "lssm_sigil"."studio_spec"("projectId", "type");

-- CreateIndex
CREATE INDEX "studio_overlay_projectId_idx" ON "lssm_sigil"."studio_overlay"("projectId");

-- CreateIndex
CREATE INDEX "studio_overlay_specId_idx" ON "lssm_sigil"."studio_overlay"("specId");

-- CreateIndex
CREATE INDEX "studio_deployment_projectId_environment_idx" ON "lssm_sigil"."studio_deployment"("projectId", "environment");

-- CreateIndex
CREATE INDEX "template_task_category_projectId_idx" ON "lssm_sigil"."template_task_category"("projectId");

-- CreateIndex
CREATE INDEX "template_task_projectId_completed_idx" ON "lssm_sigil"."template_task"("projectId", "completed");

-- CreateIndex
CREATE INDEX "template_task_categoryId_idx" ON "lssm_sigil"."template_task"("categoryId");

-- CreateIndex
CREATE INDEX "template_conversation_projectId_updatedAt_idx" ON "lssm_sigil"."template_conversation"("projectId", "updatedAt");

-- CreateIndex
CREATE INDEX "template_conversation_participant_projectId_idx" ON "lssm_sigil"."template_conversation_participant"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "template_conversation_participant_conversationId_userId_key" ON "lssm_sigil"."template_conversation_participant"("conversationId", "userId");

-- CreateIndex
CREATE INDEX "template_message_conversationId_createdAt_idx" ON "lssm_sigil"."template_message"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "template_message_projectId_idx" ON "lssm_sigil"."template_message"("projectId");

-- CreateIndex
CREATE INDEX "template_recipe_projectId_categoryId_idx" ON "lssm_sigil"."template_recipe"("projectId", "categoryId");

-- CreateIndex
CREATE INDEX "template_recipe_ingredient_recipeId_ordering_idx" ON "lssm_sigil"."template_recipe_ingredient"("recipeId", "ordering");

-- CreateIndex
CREATE INDEX "template_recipe_instruction_recipeId_ordering_idx" ON "lssm_sigil"."template_recipe_instruction"("recipeId", "ordering");

-- AddForeignKey
ALTER TABLE "lssm_sigil"."evolution_session" ADD CONSTRAINT "evolution_session_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "lssm_sigil"."studio_project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."studio_integration" ADD CONSTRAINT "studio_integration_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "lssm_sigil"."organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."studio_integration" ADD CONSTRAINT "studio_integration_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "lssm_sigil"."studio_project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."knowledge_source" ADD CONSTRAINT "knowledge_source_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "lssm_sigil"."organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."knowledge_source" ADD CONSTRAINT "knowledge_source_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "lssm_sigil"."studio_project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."lifecycle_profile" ADD CONSTRAINT "lifecycle_profile_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "lssm_sigil"."organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."lifecycle_assessment" ADD CONSTRAINT "lifecycle_assessment_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "lssm_sigil"."lifecycle_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."lifecycle_milestone_progress" ADD CONSTRAINT "lifecycle_milestone_progress_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "lssm_sigil"."lifecycle_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "lssm_sigil"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "lssm_sigil"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."member" ADD CONSTRAINT "member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "lssm_sigil"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."member" ADD CONSTRAINT "member_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "lssm_sigil"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."invitation" ADD CONSTRAINT "invitation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "lssm_sigil"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."invitation" ADD CONSTRAINT "invitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "lssm_sigil"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."invitation" ADD CONSTRAINT "invitation_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "lssm_sigil"."team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."team" ADD CONSTRAINT "team_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "lssm_sigil"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."team_member" ADD CONSTRAINT "team_member_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "lssm_sigil"."team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."team_member" ADD CONSTRAINT "team_member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "lssm_sigil"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."policy_binding" ADD CONSTRAINT "policy_binding_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "lssm_sigil"."role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."policy_binding" ADD CONSTRAINT "policy_binding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "lssm_sigil"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."policy_binding" ADD CONSTRAINT "policy_binding_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "lssm_sigil"."organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."api_key" ADD CONSTRAINT "api_key_userId_fkey" FOREIGN KEY ("userId") REFERENCES "lssm_sigil"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."passkey" ADD CONSTRAINT "passkey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "lssm_sigil"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."sso_provider" ADD CONSTRAINT "sso_provider_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "lssm_sigil"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."sso_provider" ADD CONSTRAINT "sso_provider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "lssm_sigil"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral" ADD CONSTRAINT "referral_referrerOrganizationId_fkey" FOREIGN KEY ("referrerOrganizationId") REFERENCES "lssm_sigil"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral" ADD CONSTRAINT "referral_referredOrganizationId_fkey" FOREIGN KEY ("referredOrganizationId") REFERENCES "lssm_sigil"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral_reward" ADD CONSTRAINT "referral_reward_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "lssm_sigil"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral_reward" ADD CONSTRAINT "referral_reward_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "referral"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."studio_project" ADD CONSTRAINT "studio_project_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "lssm_sigil"."organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."studio_project_team" ADD CONSTRAINT "studio_project_team_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "lssm_sigil"."studio_project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."studio_project_team" ADD CONSTRAINT "studio_project_team_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "lssm_sigil"."team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."studio_project_slug_alias" ADD CONSTRAINT "studio_project_slug_alias_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "lssm_sigil"."studio_project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."studio_learning_event" ADD CONSTRAINT "studio_learning_event_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "lssm_sigil"."studio_project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."studio_spec" ADD CONSTRAINT "studio_spec_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "lssm_sigil"."studio_project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."studio_overlay" ADD CONSTRAINT "studio_overlay_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "lssm_sigil"."studio_project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."studio_overlay" ADD CONSTRAINT "studio_overlay_specId_fkey" FOREIGN KEY ("specId") REFERENCES "lssm_sigil"."studio_spec"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."studio_deployment" ADD CONSTRAINT "studio_deployment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "lssm_sigil"."studio_project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."template_task_category" ADD CONSTRAINT "template_task_category_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "lssm_sigil"."studio_project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."template_task" ADD CONSTRAINT "template_task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "lssm_sigil"."studio_project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."template_task" ADD CONSTRAINT "template_task_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "lssm_sigil"."template_task_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."template_conversation" ADD CONSTRAINT "template_conversation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "lssm_sigil"."studio_project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."template_conversation_participant" ADD CONSTRAINT "template_conversation_participant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "lssm_sigil"."template_conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."template_conversation_participant" ADD CONSTRAINT "template_conversation_participant_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "lssm_sigil"."studio_project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."template_message" ADD CONSTRAINT "template_message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "lssm_sigil"."template_conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."template_message" ADD CONSTRAINT "template_message_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "lssm_sigil"."studio_project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."template_recipe" ADD CONSTRAINT "template_recipe_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "lssm_sigil"."studio_project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."template_recipe" ADD CONSTRAINT "template_recipe_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "lssm_sigil"."template_recipe_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."template_recipe_ingredient" ADD CONSTRAINT "template_recipe_ingredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "lssm_sigil"."template_recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lssm_sigil"."template_recipe_instruction" ADD CONSTRAINT "template_recipe_instruction_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "lssm_sigil"."template_recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
