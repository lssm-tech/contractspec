import { z } from "zod";
import type {
	AgentPromptBundle,
	AgentTarget,
	GeneratedReleaseManifest,
	GeneratedReleaseManifestEntry,
	MigrationInstruction,
	ReleaseAudienceKind,
	ReleaseCapsule,
	ReleaseCapsulePackage,
	ReleaseCapsuleValidation,
	ReleaseEnforceOn,
	ReleaseImpactAudience,
	UpgradeAutofix,
	UpgradeAutofixKind,
	UpgradePackageTarget,
	UpgradePlan,
	UpgradePlanStep,
	UpgradeStepLevel,
} from "./release-types";
import type { VersionBumpType } from "./types";

export const VersionBumpTypeSchema: z.ZodType<VersionBumpType> = z.enum([
	"patch",
	"minor",
	"major",
]);

export const AgentTargetSchema: z.ZodType<AgentTarget> = z.enum([
	"codex",
	"opencode",
	"claude-code",
]);

export const ReleaseEnforceOnSchema: z.ZodType<ReleaseEnforceOn> = z.enum([
	"release-branch",
	"always",
	"never",
]);

export const ReleaseAudienceKindSchema: z.ZodType<ReleaseAudienceKind> =
	z.enum(["maintainer", "customer", "integrator", "agent"]);

export const UpgradeStepLevelSchema: z.ZodType<UpgradeStepLevel> = z.enum([
	"auto",
	"assisted",
	"manual",
]);

export const UpgradeAutofixKindSchema: z.ZodType<UpgradeAutofixKind> = z.enum([
	"package-json",
	"contractsrc",
	"import-rewrite",
	"codemod",
]);

export const ReleaseImpactAudienceSchema: z.ZodType<ReleaseImpactAudience> =
	z.object({
		kind: ReleaseAudienceKindSchema,
		summary: z.string(),
		affectedPackages: z.array(z.string()).optional(),
		affectedRuntimes: z.array(z.string()).optional(),
		affectedFrameworks: z.array(z.string()).optional(),
	});

export const ReleaseCapsulePackageSchema: z.ZodType<ReleaseCapsulePackage> =
	z.object({
		name: z.string(),
		releaseType: VersionBumpTypeSchema,
		version: z.string().optional(),
		previousVersion: z.string().optional(),
	});

export const MigrationInstructionSchema: z.ZodType<MigrationInstruction> =
	z.object({
		id: z.string(),
		title: z.string(),
		summary: z.string(),
		required: z.boolean().default(true),
		when: z.string().optional(),
		steps: z.array(z.string()).default([]),
	});

export const UpgradeAutofixSchema: z.ZodType<UpgradeAutofix> = z.object({
	id: z.string(),
	kind: UpgradeAutofixKindSchema,
	title: z.string(),
	summary: z.string(),
	path: z.string().optional(),
	packageName: z.string().optional(),
	dependencyType: z
		.enum(["dependencies", "devDependencies", "peerDependencies"])
		.optional(),
	from: z.string().optional(),
	to: z.string().optional(),
	configPath: z.string().optional(),
	value: z.unknown().optional(),
	codemodId: z.string().optional(),
});

export const UpgradePlanStepSchema: z.ZodType<UpgradePlanStep> = z.object({
	id: z.string(),
	title: z.string(),
	summary: z.string(),
	level: UpgradeStepLevelSchema,
	instructions: z.array(z.string()).default([]),
	packages: z.array(z.string()).optional(),
	autofixes: z.array(UpgradeAutofixSchema).optional(),
});

export const AgentPromptBundleSchema: z.ZodType<AgentPromptBundle> = z.object({
	agent: AgentTargetSchema,
	title: z.string(),
	prompt: z.string(),
});

export const ReleaseCapsuleValidationSchema: z.ZodType<ReleaseCapsuleValidation> =
	z.object({
		commands: z.array(z.string()).default([]),
		evidence: z.array(z.string()).default([]),
	});

export const ReleaseCapsuleSchema: z.ZodType<ReleaseCapsule> = z.object({
	schemaVersion: z.literal("1").default("1"),
	slug: z.string(),
	summary: z.string(),
	isBreaking: z.boolean().default(false),
	packages: z.array(ReleaseCapsulePackageSchema).default([]),
	affectedRuntimes: z.array(z.string()).default([]),
	affectedFrameworks: z.array(z.string()).default([]),
	audiences: z.array(ReleaseImpactAudienceSchema).default([]),
	deprecations: z.array(z.string()).default([]),
	migrationInstructions: z.array(MigrationInstructionSchema).default([]),
	upgradeSteps: z.array(UpgradePlanStepSchema).default([]),
	validation: ReleaseCapsuleValidationSchema.default({
		commands: [],
		evidence: [],
	}),
	prompts: z.record(AgentTargetSchema, z.string()).optional(),
});

export const UpgradePackageTargetSchema: z.ZodType<UpgradePackageTarget> =
	z.object({
		name: z.string(),
		currentVersion: z.string().optional(),
		targetVersion: z.string().optional(),
	});

export const GeneratedReleaseManifestEntrySchema: z.ZodType<GeneratedReleaseManifestEntry> =
	z.object({
		slug: z.string(),
		version: z.string(),
		summary: z.string(),
		date: z.string(),
		isBreaking: z.boolean(),
		packages: z.array(ReleaseCapsulePackageSchema).default([]),
		affectedRuntimes: z.array(z.string()).default([]),
		affectedFrameworks: z.array(z.string()).default([]),
		audiences: z.array(ReleaseImpactAudienceSchema).default([]),
		deprecations: z.array(z.string()).default([]),
		migrationInstructions: z.array(MigrationInstructionSchema).default([]),
		upgradeSteps: z.array(UpgradePlanStepSchema).default([]),
		validation: ReleaseCapsuleValidationSchema.default({
			commands: [],
			evidence: [],
		}),
	});

export const GeneratedReleaseManifestSchema: z.ZodType<GeneratedReleaseManifest> =
	z.object({
		generatedAt: z.string(),
		releases: z.array(GeneratedReleaseManifestEntrySchema).default([]),
	});

export const UpgradePlanSchema: z.ZodType<UpgradePlan> = z.object({
	generatedAt: z.string(),
	targetPackages: z.array(UpgradePackageTargetSchema).default([]),
	releases: z.array(GeneratedReleaseManifestEntrySchema).default([]),
	steps: z.array(UpgradePlanStepSchema).default([]),
	autofixCount: z.number().default(0),
	manualCount: z.number().default(0),
	assistedCount: z.number().default(0),
	agentPrompts: z.array(AgentPromptBundleSchema).default([]),
});
