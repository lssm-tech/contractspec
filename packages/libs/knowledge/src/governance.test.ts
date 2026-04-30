import { describe, expect, it } from 'bun:test';
import {
	evaluateKnowledgeMutationGovernance,
	executeGovernedKnowledgeMutation,
} from './governance';

describe('knowledge mutation governance', () => {
	it('returns a dry-run plan without executing the mutation', async () => {
		let executed = false;

		const result = await executeGovernedKnowledgeMutation(
			{
				operation: 'drive.permission.update',
				governance: {
					dryRun: true,
				},
			},
			async () => {
				executed = true;
				return 'executed';
			}
		);

		expect(result.status).toBe('dry_run');
		expect(result.plan.allowed).toBe(true);
		expect(executed).toBe(false);
	});

	it('blocks outbound sends without an approved gate and approval evidence', () => {
		const plan = evaluateKnowledgeMutationGovernance({
			operation: 'gmail.message.send',
			requiresApproval: true,
			outboundSend: true,
			governance: {
				idempotencyKey: 'send-1',
				auditEvidence: {
					evidenceRef: 'audit://send-1',
				},
				outboundSendGate: {
					status: 'blocked',
					reason: 'missing-human-review',
				},
			},
		});

		expect(plan.allowed).toBe(false);
		expect(plan.requiredEvidence).toEqual(['approvalRefs', 'outboundSendGate']);
	});

	it('executes approved idempotent mutations with audit evidence', async () => {
		const auditEnvelopes: unknown[] = [];
		const result = await executeGovernedKnowledgeMutation(
			{
				operation: 'gmail.message.send',
				sourceId: 'gmail-support',
				requiresApproval: true,
				outboundSend: true,
				governance: {
					idempotencyKey: 'send-2',
					auditEvidence: {
						evidenceRef: 'audit://send-2',
						traceId: 'trace-2',
					},
					approvalRefs: [
						{
							id: 'approval-2',
							approvedBy: 'ops-lead',
							evidenceRef: 'approval://send-2',
						},
					],
					outboundSendGate: {
						status: 'approved',
						evidenceRef: 'gate://send-2',
					},
				},
			},
			async () => ({ messageId: 'gmail-message-2' }),
			{
				audit: (envelope) => {
					auditEnvelopes.push(envelope);
				},
				now: () => new Date('2025-02-05T10:00:00.000Z'),
			}
		);

		expect(result).toMatchObject({
			status: 'executed',
			idempotencyKey: 'send-2',
			auditEnvelope: {
				operation: 'gmail.message.send',
				sourceId: 'gmail-support',
				status: 'executed',
				allowed: true,
				decidedAt: '2025-02-05T10:00:00.000Z',
			},
			result: {
				messageId: 'gmail-message-2',
			},
		});
		expect(result.plan.allowed).toBe(true);
		expect(result.auditEvidence?.traceId).toBe('trace-2');
		expect(auditEnvelopes).toEqual([result.auditEnvelope]);
	});
});
