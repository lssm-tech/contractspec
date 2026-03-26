import type {
	ControlPlaneSkillManifest,
	ControlPlaneSkillVerificationIssue,
} from './types';

export function validateControlPlaneSkillManifest(
	manifest: ControlPlaneSkillManifest
): ControlPlaneSkillVerificationIssue[] {
	const issues: ControlPlaneSkillVerificationIssue[] = [];
	const skill = isRecord(manifest.skill) ? manifest.skill : null;
	const publisher = isRecord(manifest.publisher) ? manifest.publisher : null;
	const artifact = isRecord(manifest.artifact) ? manifest.artifact : null;
	if (manifest.schemaVersion !== '1.0.0') {
		issues.push({
			code: 'SCHEMA_VERSION_INVALID',
			message: `Unsupported skill manifest schema version ${manifest.schemaVersion}.`,
		});
	}
	if (
		!skill ||
		typeof skill['key'] !== 'string' ||
		typeof skill['version'] !== 'string' ||
		typeof skill['entryPoint'] !== 'string'
	) {
		issues.push({
			code: 'MANIFEST_INVALID',
			message: 'Skill manifest is missing required skill metadata.',
		});
	}
	if (
		!publisher ||
		typeof publisher['id'] !== 'string' ||
		typeof publisher['provenance'] !== 'string'
	) {
		issues.push({
			code: 'MANIFEST_INVALID',
			message: 'Skill manifest is missing required publisher metadata.',
		});
	}
	if (!artifact || typeof artifact['digest'] !== 'string') {
		issues.push({
			code: 'MANIFEST_INVALID',
			message: 'Skill manifest is missing an artifact digest.',
		});
	}
	for (const file of Array.isArray(artifact?.['files'])
		? artifact['files']
		: []) {
		if (!file.path || !file.digest || file.size < 0) {
			issues.push({
				code: 'MANIFEST_INVALID',
				message: 'Skill manifest contains an invalid artifact file entry.',
			});
		}
	}
	if (
		manifest.signature?.issuedAt &&
		Number.isNaN(Date.parse(manifest.signature.issuedAt))
	) {
		issues.push({
			code: 'MANIFEST_INVALID',
			message:
				'Skill manifest signature issuedAt is not a valid ISO timestamp.',
		});
	}
	if (
		manifest.signature?.expiresAt &&
		Number.isNaN(Date.parse(manifest.signature.expiresAt))
	) {
		issues.push({
			code: 'MANIFEST_INVALID',
			message:
				'Skill manifest signature expiresAt is not a valid ISO timestamp.',
		});
	}
	return issues;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}
