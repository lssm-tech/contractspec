import { describe, expect, it } from 'bun:test';
import { WORKFLOW_SYSTEM_DEMO_INSTANCES } from '../shared/demo-scenario';
import { createWorkflowVisualizationSections } from './selectors';

describe('workflow visualization selectors', () => {
	it('creates chart and comparison sections', () => {
		const sections = createWorkflowVisualizationSections(
			WORKFLOW_SYSTEM_DEMO_INSTANCES
		);
		expect(sections.primaryItems).toHaveLength(2);
		expect(sections.comparisonItems).toHaveLength(2);
	});
});
