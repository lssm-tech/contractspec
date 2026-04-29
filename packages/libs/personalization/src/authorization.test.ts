import { describe, expect, test } from 'bun:test';
import { insightsToOverlaySuggestion } from './adapter';
import { BehaviorAnalyzer } from './analyzer';
import { InMemoryBehaviorStore } from './store';
import { createBehaviorTracker } from './tracker';

const TENANT_ID = 'tenant-1';

describe('personalization authorization context', () => {
	test('propagates role, permission, and policy decision context into events', async () => {
		const store = new InMemoryBehaviorStore();
		const tracker = createBehaviorTracker({
			store,
			context: {
				tenantId: TENANT_ID,
				userId: 'user-1',
				role: 'editor',
				roles: ['editor', 'workspace-admin'],
				permissions: ['invoice.read', 'invoice.update'],
				policyDecisions: {
					invoiceSecret: {
						effect: 'deny',
						reason: 'missing permission',
						fields: ['secretNotes'],
						actions: ['export'],
						missing: { permissions: ['invoice.secret.read'] },
						source: 'dynamic',
					},
				},
			},
			bufferSize: 10,
		});

		tracker.trackFieldAccess({ operation: 'invoice.view', field: 'amount' });
		await tracker.flush();

		const events = await store.query({
			tenantId: TENANT_ID,
			roles: ['workspace-admin'],
			permission: 'invoice.update',
		});

		expect(events).toHaveLength(1);
		expect(events[0]?.policyDecisions?.invoiceSecret?.fields).toEqual([
			'secretNotes',
		]);
	});

	test('summarizes denied fields and keeps them out of promoted overlay fields', async () => {
		const store = new InMemoryBehaviorStore();
		await store.bulkRecord([
			...Array.from({ length: 20 }, (_, index) => ({
				type: 'field_access' as const,
				tenantId: TENANT_ID,
				timestamp: index + 1,
				operation: 'invoice.view',
				field: 'secretNotes',
				policyDecisions: {
					invoiceSecret: {
						effect: 'deny' as const,
						fields: ['secretNotes'],
					},
				},
			})),
			...Array.from({ length: 20 }, (_, index) => ({
				type: 'field_access' as const,
				tenantId: TENANT_ID,
				timestamp: index + 30,
				operation: 'invoice.view',
				field: 'amount',
			})),
		]);

		const analyzer = new BehaviorAnalyzer(store, {
			fieldInactivityThreshold: 3,
		});
		const insights = await analyzer.analyze({ tenantId: TENANT_ID });

		expect(insights.deniedFields).toEqual(['secretNotes']);
		expect(insights.frequentlyUsedFields).toEqual(['amount']);

		const overlay = insightsToOverlaySuggestion(insights, {
			overlayId: 'invoice-personalization',
			tenantId: TENANT_ID,
			capability: 'invoice',
		});

		expect(overlay?.modifications).toContainEqual({
			type: 'reorderFields',
			fields: ['amount'],
		});
	});

	test('does not emit reorder suggestions when all frequent fields are denied', () => {
		const overlay = insightsToOverlaySuggestion(
			{
				unusedFields: [],
				frequentlyUsedFields: ['secretNotes'],
				suggestedHiddenFields: [],
				deniedFields: ['secretNotes'],
				workflowBottlenecks: [],
			},
			{
				overlayId: 'invoice-personalization',
				tenantId: TENANT_ID,
				capability: 'invoice',
			}
		);

		expect(overlay).toBeNull();
	});
});
