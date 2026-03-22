import { describe, expect, it } from 'bun:test';
import { generateKeyPairSync } from 'crypto';
import type { ControlPlaneSkillManifest } from './skills';
import {
	signControlPlaneSkillManifest,
	verifyControlPlaneSkillManifest,
} from './skills';

function createManifest(): ControlPlaneSkillManifest {
	return {
		schemaVersion: '1.0.0',
		skill: {
			key: 'control-plane.slack-approval',
			version: '1.0.0',
			entryPoint: 'dist/index.js',
			description: 'Routes control-plane approvals into Slack workflows.',
		},
		publisher: {
			id: 'contractspec',
			provenance: 'github:contractspec/skills/slack-approval',
			repositoryUrl: 'https://github.com/lssm-tech/contractspec',
		},
		artifact: {
			digest: 'sha256:skill-bundle',
			files: [{ path: 'dist/index.js', digest: 'sha256:file-1', size: 1200 }],
		},
		compatibility: {
			contractsSpec: { minVersion: '4.0.0', maxVersion: '5.0.0' },
			controlPlaneFeature: { minVersion: '1.0.0', maxVersion: '1.1.0' },
			requiredCapabilities: [
				{ key: 'control-plane.skill-registry', version: '1.0.0' },
			],
		},
	};
}

describe('control-plane skill verification', () => {
	it('verifies a trusted, signed, and compatible skill manifest', () => {
		const { privateKey } = generateKeyPairSync('ed25519');
		const signed = signControlPlaneSkillManifest(createManifest(), privateKey, {
			keyId: 'publisher-main',
		});
		const report = verifyControlPlaneSkillManifest({
			manifest: signed,
			trustPolicy: {
				trustedPublishers: [
					{
						id: 'contractspec',
						keyIds: ['publisher-main'],
						publicKeys: [signed.signature!.publicKey],
						provenancePrefixes: ['github:contractspec/skills/'],
					},
				],
			},
			runtime: {
				contractsSpecVersion: '4.1.3',
				controlPlaneFeatureVersion: '1.0.0',
				availableCapabilities: [
					{ key: 'control-plane.skill-registry', version: '1.0.0' },
				],
			},
			expectedArtifactDigest: 'sha256:skill-bundle',
		});

		expect(report.verified).toBe(true);
		expect(report.issues).toHaveLength(0);
	});

	it('rejects tampered manifests', () => {
		const { privateKey } = generateKeyPairSync('ed25519');
		const signed = signControlPlaneSkillManifest(createManifest(), privateKey);
		signed.skill.entryPoint = 'dist/tampered.js';

		const report = verifyControlPlaneSkillManifest({
			manifest: signed,
			trustPolicy: { trustedPublishers: [{ id: 'contractspec' }] },
			runtime: { contractsSpecVersion: '4.1.3' },
		});

		expect(report.verified).toBe(false);
		expect(report.issues.map((issue) => issue.code)).toContain(
			'SIGNATURE_INVALID'
		);
	});

	it('rejects untrusted publishers and incompatible runtimes', () => {
		const { privateKey } = generateKeyPairSync('ed25519');
		const signed = signControlPlaneSkillManifest(createManifest(), privateKey, {
			keyId: 'publisher-main',
			expiresAt: '2026-03-20T00:00:00.000Z',
		});

		const report = verifyControlPlaneSkillManifest({
			manifest: signed,
			trustPolicy: {
				trustedPublishers: [
					{ id: 'other-publisher', keyIds: ['different-key'] },
				],
			},
			runtime: {
				contractsSpecVersion: '3.9.0',
				controlPlaneFeatureVersion: '2.0.0',
				availableCapabilities: [],
			},
			expectedArtifactDigest: 'sha256:other',
			now: new Date('2026-03-22T00:00:00.000Z'),
		});

		expect(report.verified).toBe(false);
		expect(report.issues.map((issue) => issue.code)).toEqual(
			expect.arrayContaining([
				'PUBLISHER_UNTRUSTED',
				'SIGNATURE_EXPIRED',
				'ARTIFACT_DIGEST_MISMATCH',
				'CONTRACTS_SPEC_TOO_OLD',
				'CONTROL_PLANE_TOO_NEW',
				'CAPABILITY_MISSING',
			])
		);
	});
});
