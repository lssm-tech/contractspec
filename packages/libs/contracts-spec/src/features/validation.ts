import type { PresentationSpec } from '../presentations/presentations';
import type { FeatureModuleSpec } from './types';

export type FeatureValidationLevel = 'error' | 'warning' | 'info';

export interface FeatureValidationIssue {
	level: FeatureValidationLevel;
	message: string;
	path?: string;
	context?: Record<string, unknown>;
}

export interface FeatureValidationResult {
	valid: boolean;
	issues: FeatureValidationIssue[];
}

export class FeatureValidationError extends Error {
	constructor(
		message: string,
		public readonly issues: FeatureValidationIssue[]
	) {
		super(message);
		this.name = 'FeatureValidationError';
	}
}

/** Ensure declared target requirements exist on the provided descriptors. */
export function validateFeatureTargetsV2(
	feature: FeatureModuleSpec,
	descriptors: PresentationSpec[]
) {
	if (
		!feature.presentationsTargets ||
		feature.presentationsTargets.length === 0
	)
		return true;
	for (const req of feature.presentationsTargets) {
		const d = descriptors.find(
			(x) => x.meta.key === req.key && x.meta.version === req.version
		);
		if (!d)
			throw new Error(`V2 descriptor not found ${req.key}.v${req.version}`);
		for (const t of req.targets)
			if (!d.targets.includes(t))
				throw new Error(
					`Descriptor ${req.key}.v${req.version} missing target ${t}`
				);
	}
	return true;
}

export function validateFeatureSpec(
	spec: FeatureModuleSpec
): FeatureValidationResult {
	const issues: FeatureValidationIssue[] = [];

	validateMeta(spec, issues);
	validateDuplicates(spec, issues);
	validateFeatureMaterial(spec, issues);
	validateOpToPresentation(spec, issues);
	validatePresentationTargets(spec, issues);

	return {
		valid: issues.every((issue) => issue.level !== 'error'),
		issues,
	};
}

export function assertFeatureSpecValid(spec: FeatureModuleSpec): void {
	const result = validateFeatureSpec(spec);
	if (!result.valid) {
		throw new FeatureValidationError(
			`Feature ${spec.meta.key}.v${spec.meta.version} is invalid`,
			result.issues
		);
	}
}

function validateMeta(
	spec: FeatureModuleSpec,
	issues: FeatureValidationIssue[]
): void {
	requireNonEmpty(
		spec.meta.key,
		'Feature must have a non-empty key',
		'meta.key',
		issues
	);
	requireNonEmpty(
		spec.meta.version,
		'Feature must have a non-empty version',
		'meta.version',
		issues
	);
	requireNonEmpty(
		spec.meta.description,
		'Feature must have a non-empty description',
		'meta.description',
		issues
	);

	if (!spec.meta.stability) {
		issues.push({
			level: 'error',
			message: 'Feature must declare a stability level',
			path: 'meta.stability',
		});
	}

	if (!spec.meta.owners.length) {
		issues.push({
			level: 'error',
			message: 'Feature must declare at least one owner',
			path: 'meta.owners',
		});
	}

	if (!spec.meta.tags.length) {
		issues.push({
			level: 'error',
			message: 'Feature must declare at least one tag',
			path: 'meta.tags',
		});
	}
}

function validateFeatureMaterial(
	spec: FeatureModuleSpec,
	issues: FeatureValidationIssue[]
): void {
	if (
		Boolean(spec.operations?.length) ||
		Boolean(spec.events?.length) ||
		Boolean(spec.presentations?.length) ||
		Boolean(spec.experiments?.length) ||
		Boolean(spec.capabilities?.provides?.length) ||
		Boolean(spec.capabilities?.requires?.length) ||
		Boolean(spec.opToPresentation?.length) ||
		Boolean(spec.presentationsTargets?.length) ||
		Boolean(spec.implementations?.length) ||
		Boolean(spec.dataViews?.length) ||
		Boolean(spec.visualizations?.length) ||
		Boolean(spec.forms?.length) ||
		Boolean(spec.workflows?.length) ||
		Boolean(spec.knowledge?.length) ||
		Boolean(spec.telemetry?.length) ||
		Boolean(spec.policies?.length) ||
		Boolean(spec.integrations?.length) ||
		Boolean(spec.jobs?.length) ||
		Boolean(spec.translations?.length) ||
		Boolean(spec.docs?.length)
	) {
		return;
	}

	issues.push({
		level: 'warning',
		message:
			'Feature declares only metadata; add refs, docs, or implementations to make it actionable',
		path: 'meta',
	});
}

function validateDuplicates(
	spec: FeatureModuleSpec,
	issues: FeatureValidationIssue[]
): void {
	validateVersionedRefDuplicates(spec.operations, 'operations', issues);
	validateVersionedRefDuplicates(spec.events, 'events', issues);
	validateVersionedRefDuplicates(spec.presentations, 'presentations', issues);
	validateVersionedRefDuplicates(spec.experiments, 'experiments', issues);
	validateVersionedRefDuplicates(
		spec.capabilities?.provides,
		'capabilities.provides',
		issues
	);
	validateRequirementDuplicates(spec.capabilities?.requires, issues);
	validateVersionedRefDuplicates(spec.dataViews, 'dataViews', issues);
	validateVersionedRefDuplicates(spec.visualizations, 'visualizations', issues);
	validateVersionedRefDuplicates(spec.forms, 'forms', issues);
	validateVersionedRefDuplicates(spec.workflows, 'workflows', issues);
	validateVersionedRefDuplicates(spec.knowledge, 'knowledge', issues);
	validateVersionedRefDuplicates(spec.telemetry, 'telemetry', issues);
	validateVersionedRefDuplicates(spec.policies, 'policies', issues);
	validateVersionedRefDuplicates(spec.integrations, 'integrations', issues);
	validateVersionedRefDuplicates(spec.jobs, 'jobs', issues);
	validateTranslationDuplicates(spec.translations, issues);
	validateStringDuplicates(spec.docs, 'docs', issues);
}

function validateOpToPresentation(
	spec: FeatureModuleSpec,
	issues: FeatureValidationIssue[]
): void {
	const operationKeys = new Set(
		(spec.operations ?? []).map((ref) => `${ref.key}.v${ref.version}`)
	);
	const presentationKeys = new Set(
		(spec.presentations ?? []).map((ref) => `${ref.key}.v${ref.version}`)
	);

	spec.opToPresentation?.forEach((link, index) => {
		const path = `opToPresentation[${index}]`;
		if (!operationKeys.has(`${link.op.key}.v${link.op.version}`)) {
			issues.push({
				level: 'error',
				message: `Linked operation ${link.op.key}.v${link.op.version} is not declared in feature.operations`,
				path: `${path}.op`,
			});
		}

		if (!presentationKeys.has(`${link.pres.key}.v${link.pres.version}`)) {
			issues.push({
				level: 'error',
				message: `Linked presentation ${link.pres.key}.v${link.pres.version} is not declared in feature.presentations`,
				path: `${path}.pres`,
			});
		}
	});
}

function validatePresentationTargets(
	spec: FeatureModuleSpec,
	issues: FeatureValidationIssue[]
): void {
	const presentationKeys = new Set(
		(spec.presentations ?? []).map((ref) => `${ref.key}.v${ref.version}`)
	);
	const seen = new Set<string>();

	spec.presentationsTargets?.forEach((target, index) => {
		const path = `presentationsTargets[${index}]`;
		const key = `${target.key}.v${target.version}`;

		if (seen.has(key)) {
			issues.push({
				level: 'error',
				message: `Duplicate presentation target requirement for ${key}`,
				path,
			});
		}
		seen.add(key);

		if (!presentationKeys.has(key)) {
			issues.push({
				level: 'error',
				message: `Presentation target requirement ${key} is not declared in feature.presentations`,
				path,
			});
		}

		if (!target.targets.length) {
			issues.push({
				level: 'error',
				message: `Presentation target requirement ${key} must declare at least one target`,
				path: `${path}.targets`,
			});
		}
	});
}

function validateVersionedRefDuplicates(
	refs: Array<{ key: string; version?: string }> | undefined,
	path: string,
	issues: FeatureValidationIssue[]
): void {
	if (!refs?.length) {
		return;
	}

	const seen = new Set<string>();
	refs.forEach((ref, index) => {
		const key = `${ref.key}.v${ref.version ?? '*'}`;
		if (seen.has(key)) {
			issues.push({
				level: 'error',
				message: `Duplicate reference ${key} in ${path}`,
				path: `${path}[${index}]`,
			});
		}
		seen.add(key);
	});
}

function validateRequirementDuplicates(
	refs: Array<{ key: string; version?: string }> | undefined,
	issues: FeatureValidationIssue[]
): void {
	if (!refs?.length) {
		return;
	}

	const seen = new Set<string>();
	refs.forEach((ref, index) => {
		const key = `${ref.key}.v${ref.version ?? '*'}`;
		if (seen.has(key)) {
			issues.push({
				level: 'error',
				message: `Duplicate capability requirement ${key}`,
				path: `capabilities.requires[${index}]`,
			});
		}
		seen.add(key);
	});
}

function validateTranslationDuplicates(
	refs: Array<{ key: string; version: string; locale?: string }> | undefined,
	issues: FeatureValidationIssue[]
): void {
	if (!refs?.length) {
		return;
	}

	const seen = new Set<string>();
	refs.forEach((ref, index) => {
		const key = `${ref.key}.v${ref.version}:${ref.locale ?? '*'}`;
		if (seen.has(key)) {
			issues.push({
				level: 'error',
				message: `Duplicate translation reference ${key}`,
				path: `translations[${index}]`,
			});
		}
		seen.add(key);
	});
}

function validateStringDuplicates(
	values: string[] | undefined,
	path: string,
	issues: FeatureValidationIssue[]
): void {
	if (!values?.length) {
		return;
	}

	const seen = new Set<string>();
	values.forEach((value, index) => {
		if (seen.has(value)) {
			issues.push({
				level: 'error',
				message: `Duplicate value "${value}" in ${path}`,
				path: `${path}[${index}]`,
			});
		}
		seen.add(value);
	});
}

function requireNonEmpty(
	value: string | undefined,
	message: string,
	path: string,
	issues: FeatureValidationIssue[]
): void {
	if (value?.trim()) {
		return;
	}

	issues.push({
		level: 'error',
		message,
		path,
	});
}
