import { describe, expect, test } from 'bun:test';
import {
	PREFERENCE_DIMENSION_PRESETS,
	suggestPreferenceEvolution,
} from './preference-dimensions';

const balanced = PREFERENCE_DIMENSION_PRESETS.balanced;

describe('preference evolution suggestions', () => {
	test('suggests scoped, reversible changes from repeated behavior', () => {
		const suggestions = suggestPreferenceEvolution({
			current: balanced,
			observations: [
				{
					dimension: 'density',
					value: 'detailed',
					signal: 'setting_changed',
					surfaceId: 'orders',
					sessionId: 's1',
					reason: 'Changed orders density to detailed.',
				},
				{
					dimension: 'density',
					value: 'detailed',
					signal: 'setting_changed',
					surfaceId: 'orders',
					sessionId: 's2',
				},
				{
					dimension: 'density',
					value: 'detailed',
					signal: 'setting_changed',
					surfaceId: 'orders',
					sessionId: 's3',
				},
			],
		});

		expect(suggestions).toHaveLength(1);
		expect(suggestions[0]).toMatchObject({
			dimension: 'density',
			from: 'standard',
			to: 'detailed',
			scope: 'surface',
			requiresConfirmation: true,
			reversible: true,
			patch: { density: 'detailed' },
		});
		expect(suggestions[0]?.reasons.join(' ')).toContain(
			'not a hidden global mutation'
		);
	});

	test('requires stronger evidence before promoting beyond a surface', () => {
		const oneSurface = suggestPreferenceEvolution({
			current: balanced,
			preferredScope: 'workspace-user',
			observations: mediaObservations(['monitor', 'monitor', 'monitor']),
		});
		const crossSurface = suggestPreferenceEvolution({
			current: balanced,
			preferredScope: 'workspace-user',
			observations: mediaObservations(['monitor', 'dashboard', 'incidents']),
		});

		expect(oneSurface[0]?.scope).toBe('surface');
		expect(crossSurface[0]?.scope).toBe('workspace-user');
		expect(crossSurface[0]?.requiresConfirmation).toBe(true);
	});

	test('lets explicit user choices beat inferred behavior', () => {
		const suggestions = suggestPreferenceEvolution({
			current: balanced,
			observations: [
				{
					dimension: 'dataDepth',
					value: 'summary',
					signal: 'explicit_choice',
					explicit: true,
					sessionId: 's1',
				},
				...['s1', 's2', 's3'].map((sessionId) => ({
					dimension: 'dataDepth' as const,
					value: 'exhaustive' as const,
					signal: 'evidence_opened' as const,
					sessionId,
				})),
			],
		});

		expect(suggestions).toHaveLength(1);
		expect(suggestions[0]).toMatchObject({
			dimension: 'dataDepth',
			to: 'summary',
			requiresConfirmation: true,
		});
	});

	test('ignores invalid dimension value pairs from untyped event sources', () => {
		const suggestions = suggestPreferenceEvolution({
			current: balanced,
			observations: ['s1', 's2', 's3'].map((sessionId) => ({
				dimension: 'density',
				value: 'visual',
				signal: 'setting_changed',
				surfaceId: 'orders',
				sessionId,
			})) as never,
		});

		expect(suggestions).toEqual([]);
	});
});

function mediaObservations(surfaces: string[]) {
	return surfaces.map((surfaceId, index) => ({
		dimension: 'media' as const,
		value: 'visual' as const,
		signal: 'media_mode_changed' as const,
		surfaceId,
		sessionId: `s${index + 1}`,
	}));
}
