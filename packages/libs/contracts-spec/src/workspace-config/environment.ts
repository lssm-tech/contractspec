import * as z from 'zod';
import { validateEnvironmentConfig } from './environment-validation';

export { isPublicEnvironmentAlias } from './environment-validation';

export type EnvironmentSensitivity =
	| 'public'
	| 'internal'
	| 'sensitive'
	| 'secret';

export type EnvironmentLifecycle = 'build-time' | 'runtime' | 'both';

export type EnvironmentSurface =
	| 'server'
	| 'public-client'
	| 'native-client'
	| 'edge'
	| 'worker'
	| 'ci';

export type AppEnvironmentFramework =
	| 'next'
	| 'expo'
	| 'node'
	| 'vite'
	| 'worker'
	| 'custom';

export type EnvironmentValueSourceType =
	| 'literal'
	| 'env'
	| 'secret'
	| 'managed-connection'
	| 'byok-connection';

export type EnvironmentAliasMaterialization =
	| 'env-file'
	| 'process-env'
	| 'next-config-env';

export interface EnvironmentValueSource {
	type: EnvironmentValueSourceType;
	ref?: string;
	envVar?: string;
	value?: string | number | boolean;
	connectionId?: string;
	secretRef?: string;
}

export interface EnvVariableAlias {
	name: string;
	targetId?: string;
	framework?: AppEnvironmentFramework;
	profile?: string;
	exposure?: EnvironmentSurface;
	materialization?: EnvironmentAliasMaterialization;
}

export interface EnvironmentVariableDefinition {
	key: string;
	description?: string;
	sensitivity?: EnvironmentSensitivity;
	lifecycle?: EnvironmentLifecycle;
	allowedSurfaces?: EnvironmentSurface[];
	requiredProfiles?: string[];
	defaultValue?: string | number | boolean;
	example?: string;
	valueSource?: EnvironmentValueSource;
	aliases?: EnvVariableAlias[];
}

export interface AppEnvironmentTarget {
	id: string;
	packageName?: string;
	packagePath?: string;
	appId?: string;
	framework?: AppEnvironmentFramework;
	surfaces?: EnvironmentSurface[];
	profiles?: string[];
	envFiles?: string[];
}

export interface EnvironmentProfileConfig {
	envFiles?: string[];
	secretProviders?: string[];
	variables?: Record<string, EnvironmentValueSource>;
}

export interface SecretRequirementConfig {
	key: string;
	description?: string;
	required?: boolean;
	provider?: string;
	envVar?: string;
	secretRefPattern?: string;
	rotationDays?: number;
}

export interface EnvironmentConfig {
	profiles?: Record<string, EnvironmentProfileConfig>;
	variables?: Record<string, EnvironmentVariableDefinition>;
	targets?: Record<string, AppEnvironmentTarget>;
	secretRequirements?: Record<string, SecretRequirementConfig>;
}

export const EnvironmentSensitivitySchema: z.ZodType<EnvironmentSensitivity> =
	z.enum(['public', 'internal', 'sensitive', 'secret']);

export const EnvironmentLifecycleSchema: z.ZodType<EnvironmentLifecycle> =
	z.enum(['build-time', 'runtime', 'both']);

export const EnvironmentSurfaceSchema: z.ZodType<EnvironmentSurface> = z.enum([
	'server',
	'public-client',
	'native-client',
	'edge',
	'worker',
	'ci',
]);

export const AppEnvironmentFrameworkSchema: z.ZodType<AppEnvironmentFramework> =
	z.enum(['next', 'expo', 'node', 'vite', 'worker', 'custom']);

export const EnvironmentValueSourceSchema: z.ZodType<EnvironmentValueSource> =
	z.object({
		type: z.enum([
			'literal',
			'env',
			'secret',
			'managed-connection',
			'byok-connection',
		]),
		ref: z.string().optional(),
		envVar: z.string().optional(),
		value: z.union([z.string(), z.number(), z.boolean()]).optional(),
		connectionId: z.string().optional(),
		secretRef: z.string().optional(),
	});

export const EnvVariableAliasSchema: z.ZodType<EnvVariableAlias> = z.object({
	name: z.string().min(1),
	targetId: z.string().optional(),
	framework: AppEnvironmentFrameworkSchema.optional(),
	profile: z.string().optional(),
	exposure: EnvironmentSurfaceSchema.optional(),
	materialization: z
		.enum(['env-file', 'process-env', 'next-config-env'])
		.default('env-file')
		.optional(),
});

export const EnvironmentVariableDefinitionSchema: z.ZodType<EnvironmentVariableDefinition> =
	z.object({
		key: z.string().min(1),
		description: z.string().optional(),
		sensitivity: EnvironmentSensitivitySchema.default('internal').optional(),
		lifecycle: EnvironmentLifecycleSchema.default('runtime').optional(),
		allowedSurfaces: z.array(EnvironmentSurfaceSchema).optional(),
		requiredProfiles: z.array(z.string()).optional(),
		defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
		example: z.string().optional(),
		valueSource: EnvironmentValueSourceSchema.optional(),
		aliases: z.array(EnvVariableAliasSchema).optional(),
	});

export const AppEnvironmentTargetSchema: z.ZodType<AppEnvironmentTarget> =
	z.object({
		id: z.string().min(1),
		packageName: z.string().optional(),
		packagePath: z.string().optional(),
		appId: z.string().optional(),
		framework: AppEnvironmentFrameworkSchema.optional(),
		surfaces: z.array(EnvironmentSurfaceSchema).optional(),
		profiles: z.array(z.string()).optional(),
		envFiles: z.array(z.string()).optional(),
	});

export const EnvironmentProfileConfigSchema: z.ZodType<EnvironmentProfileConfig> =
	z.object({
		envFiles: z.array(z.string()).optional(),
		secretProviders: z.array(z.string()).optional(),
		variables: z.record(z.string(), EnvironmentValueSourceSchema).optional(),
	});

export const SecretRequirementConfigSchema: z.ZodType<SecretRequirementConfig> =
	z.object({
		key: z.string().min(1),
		description: z.string().optional(),
		required: z.boolean().default(true).optional(),
		provider: z.string().optional(),
		envVar: z.string().optional(),
		secretRefPattern: z.string().optional(),
		rotationDays: z.number().int().positive().optional(),
	});

export const EnvironmentConfigSchema: z.ZodType<EnvironmentConfig> = z
	.object({
		profiles: z.record(z.string(), EnvironmentProfileConfigSchema).optional(),
		variables: z
			.record(z.string(), EnvironmentVariableDefinitionSchema)
			.optional(),
		targets: z.record(z.string(), AppEnvironmentTargetSchema).optional(),
		secretRequirements: z
			.record(z.string(), SecretRequirementConfigSchema)
			.optional(),
	})
	.superRefine((config, ctx) => {
		validateEnvironmentConfig(config, ctx);
	});
