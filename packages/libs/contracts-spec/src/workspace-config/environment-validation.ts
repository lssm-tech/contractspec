import type * as z from 'zod';
import type { EnvironmentConfig } from './environment';
import { validateAliasCollisions } from './environment-validation-alias';

export function isPublicEnvironmentAlias(name: string): boolean {
	return name.startsWith('NEXT_PUBLIC_') || name.startsWith('EXPO_PUBLIC_');
}

export function validateEnvironmentConfig(
	config: EnvironmentConfig,
	ctx: z.RefinementCtx
) {
	validateVariableExposure(config, ctx);
	validateAliasCollisions(config, ctx);
}

function validateVariableExposure(
	config: EnvironmentConfig,
	ctx: z.RefinementCtx
) {
	for (const [recordKey, definition] of Object.entries(
		config.variables ?? {}
	)) {
		const sensitivity = definition.sensitivity ?? 'internal';
		if (
			(sensitivity === 'secret' || sensitivity === 'sensitive') &&
			definition.defaultValue !== undefined
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['variables', recordKey, 'defaultValue'],
				message: 'Secret and sensitive variables cannot define defaultValue.',
			});
		}
		for (const [index, alias] of (definition.aliases ?? []).entries()) {
			const publicExposure =
				alias.exposure === 'public-client' ||
				alias.exposure === 'native-client' ||
				alias.materialization === 'next-config-env' ||
				isPublicEnvironmentAlias(alias.name);
			if (publicExposure && sensitivity !== 'public') {
				ctx.addIssue({
					code: 'custom',
					path: ['variables', recordKey, 'aliases', index, 'name'],
					message:
						'Public env aliases require sensitivity "public"; never expose secret or sensitive values.',
				});
			}
		}
	}
}
