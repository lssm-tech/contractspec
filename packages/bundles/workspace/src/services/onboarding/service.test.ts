import { afterEach, describe, expect, it } from 'bun:test';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DEFAULT_CONTRACTSRC } from '@contractspec/lib.contracts-spec/workspace-config';
import { createNodeAdapters } from '../../adapters';
import {
	buildOnboardingPlan,
	createOnboardingConnectArtifacts,
} from './service';

describe('onboarding service', () => {
	const tempDirs: string[] = [];

	afterEach(async () => {
		await Promise.all(
			tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true }))
		);
	});

	it('builds a guided journey with wizard guidance and ordered recommendations', async () => {
		const root = await mkdtemp(join(tmpdir(), 'contractspec-onboard-'));
		tempDirs.push(root);
		await writeFile(
			join(root, 'package.json'),
			JSON.stringify({ name: 'demo-onboard', type: 'module' }, null, 2)
		);

		const adapters = createNodeAdapters({ cwd: root, silent: true });
		const plan = await buildOnboardingPlan(adapters, { cwd: root });

		expect(plan.primaryTrack.id).toBeString();
		expect(plan.recommendations.length).toBe(5);
		expect(plan.journeyContext.mode).toBe('guided');
		expect(plan.journeyContext.preferences.guidance).toBe('wizard');
		expect(plan.journeyPlan.adaptation.appliedDimensions.guidance).toBe(
			'wizard'
		);
		expect(plan.recommendations[0]?.selected).toBeTrue();
		expect(plan.recommendations.every((item) => item.reason.length > 0)).toBe(
			true
		);
	});

	it('builds Connect-backed onboarding artifacts when Connect is enabled', async () => {
		const root = await mkdtemp(join(tmpdir(), 'contractspec-onboard-'));
		tempDirs.push(root);
		await writeFile(
			join(root, 'package.json'),
			JSON.stringify({ name: 'demo-onboard', type: 'module' }, null, 2)
		);
		await writeFile(
			join(root, '.contractsrc.json'),
			JSON.stringify(
				{
					connect: {
						enabled: true,
					},
				},
				null,
				2
			)
		);

		const adapters = createNodeAdapters({ cwd: root, silent: true });
		const plan = await buildOnboardingPlan(adapters, {
			config: {
				...DEFAULT_CONTRACTSRC,
				connect: {
					...DEFAULT_CONTRACTSRC.connect,
					enabled: true,
				},
			},
			cwd: root,
			selectedTracks: ['knowledge'],
		});
		const artifacts = await createOnboardingConnectArtifacts(adapters, plan);

		expect(artifacts).toBeDefined();
		expect(artifacts?.contextPack.affectedSurfaces).toContain('knowledge');
		expect(artifacts?.contextPack.affectedSurfaces).toContain('mcp');
		expect(artifacts?.planPacket.affectedSurfaces).toContain('runtime');
		expect(artifacts?.planPacket.objective).toContain('knowledge');
	});
});
