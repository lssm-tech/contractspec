import type * as z from 'zod';
import type { AppEnvironmentFramework, EnvironmentConfig } from './environment';

interface AliasScope {
	logicalKey: string;
	name: string;
	targetId?: string;
	profile?: string;
	framework?: AppEnvironmentFramework;
}

export function validateAliasCollisions(
	config: EnvironmentConfig,
	ctx: z.RefinementCtx
) {
	const seen: AliasScope[] = [];
	for (const [recordKey, definition] of Object.entries(
		config.variables ?? {}
	)) {
		for (const [index, alias] of (definition.aliases ?? []).entries()) {
			const scope = { ...alias, logicalKey: definition.key };
			const existing = seen.find(
				(item) =>
					item.name === alias.name &&
					item.logicalKey !== definition.key &&
					scopesOverlap(item, scope)
			);
			if (existing) {
				ctx.addIssue({
					code: 'custom',
					path: ['variables', recordKey, 'aliases', index, 'name'],
					message: `Alias "${alias.name}" collides in target scope with logical variable "${existing.logicalKey}".`,
				});
			}
			seen.push(scope);
		}
	}
}

function scopesOverlap(left: AliasScope, right: AliasScope) {
	return (
		fieldOverlaps(left.targetId, right.targetId) &&
		fieldOverlaps(left.profile, right.profile) &&
		fieldOverlaps(left.framework, right.framework)
	);
}

function fieldOverlaps(left: string | undefined, right: string | undefined) {
	return left === undefined || right === undefined || left === right;
}
