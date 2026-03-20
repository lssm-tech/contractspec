import { describe, expect, it } from 'bun:test';
import { createIntegrationVisualizationSections } from './selectors';

describe('integration visualization selectors', () => {
	it('creates chart and comparison items', () => {
		const sections = createIntegrationVisualizationSections(
			[{ type: 'CRM' }, { type: 'CRM' }, { type: 'PAYMENT' }],
			[{ status: 'CONNECTED' }, { status: 'ERROR' }],
			[
				{ status: 'ACTIVE', recordsSynced: 10 },
				{ status: 'FAILED', recordsSynced: 0 },
			]
		);

		expect(sections.primaryItems).toHaveLength(2);
		expect(sections.comparisonItems).toHaveLength(2);
	});
});
