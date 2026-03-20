import { describe, expect, it } from 'bun:test';
import {
	VisualizationShowcaseRefs,
	VisualizationShowcaseSpecMap,
	VisualizationShowcaseSpecs,
	createVisualizationShowcaseComparisonItems,
	createVisualizationShowcaseGridItems,
	createVisualizationShowcaseTimelineItems,
} from './index';

describe('visualization showcase catalog', () => {
	it('registers every primitive spec', () => {
		expect(VisualizationShowcaseSpecs.length).toBe(9);
		expect(VisualizationShowcaseRefs.length).toBe(9);
		expect(VisualizationShowcaseSpecMap.size).toBe(9);
	});

	it('builds primitive and composite items', () => {
		expect(createVisualizationShowcaseGridItems().length).toBe(9);
		expect(createVisualizationShowcaseComparisonItems().length).toBe(3);
		expect(createVisualizationShowcaseTimelineItems().length).toBe(2);
	});
});
