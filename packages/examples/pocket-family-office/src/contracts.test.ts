import { describe, expect, test } from 'bun:test';
import {
	PocketFamilyOfficeFeature,
	pocketFamilyOfficeTelemetry,
} from './index';

describe('@contractspec/example.pocket-family-office', () => {
	test('exports the canonical telemetry spec', () => {
		expect(pocketFamilyOfficeTelemetry.meta.key).toBe('pfo.telemetry');
		expect(pocketFamilyOfficeTelemetry.events.length).toBeGreaterThan(0);
		expect(PocketFamilyOfficeFeature.telemetry).toEqual([
			{
				key: pocketFamilyOfficeTelemetry.meta.key,
				version: pocketFamilyOfficeTelemetry.meta.version,
			},
		]);
	});
});
