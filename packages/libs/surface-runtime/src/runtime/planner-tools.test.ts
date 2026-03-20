import { describe, expect, it } from 'bun:test';
import {
	buildSurfacePatchProposal,
	proposePatchToolConfig,
} from './planner-tools';

describe('proposePatchToolConfig', () => {
	it('has correct name and description', () => {
		expect(proposePatchToolConfig.name).toBe('propose-patch');
		expect(proposePatchToolConfig.description).toContain('surface patches');
		expect(proposePatchToolConfig.requiresApproval).toBe(true);
	});

	it('has schema with proposalId and ops', () => {
		const schema = proposePatchToolConfig.schema as {
			properties?: { proposalId?: unknown; ops?: unknown };
			required?: string[];
		};
		expect(schema).toBeDefined();
		expect(schema?.properties?.proposalId).toBeDefined();
		expect(schema?.properties?.ops).toBeDefined();
		expect(schema?.required).toContain('proposalId');
		expect(schema?.required).toContain('ops');
	});
});

describe('buildSurfacePatchProposal', () => {
	it('builds proposal with source assistant and proposed state', () => {
		const ops = [
			{
				op: 'insert-node' as const,
				slotId: 'primary',
				node: {
					nodeId: 'n1',
					kind: 'entity-card' as const,
					title: 'Card',
				},
			},
		];
		const proposal = buildSurfacePatchProposal('prop_1', ops);
		expect(proposal.proposalId).toBe('prop_1');
		expect(proposal.source).toBe('assistant');
		expect(proposal.approvalState).toBe('proposed');
		expect(proposal.ops).toEqual(ops);
	});
});
