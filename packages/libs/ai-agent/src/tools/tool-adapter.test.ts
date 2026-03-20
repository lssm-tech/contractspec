import { describe, expect, it } from 'bun:test';
import { specToolToAISDKTool } from './tool-adapter';

describe('specToolToAISDKTool', () => {
	it('enforces cooldown between tool invocations', async () => {
		const tool = specToolToAISDKTool(
			{
				name: 'cooldown_tool',
				cooldownMs: 1000,
			},
			async () => 'ok',
			{
				agentId: 'agent.test',
				sessionId: 'session.test',
			}
		);

		const execute = tool.execute;
		if (!execute) {
			throw new Error('Tool execute handler is missing');
		}

		// Consume async generator to complete first invocation
		for await (const _ of execute({}, { toolCallId: 'call-1', messages: [] })) {
			void _;
		}

		await expect(
			(async () => {
				for await (const _ of execute(
					{},
					{ toolCallId: 'call-2', messages: [] }
				)) {
					void _;
				}
			})()
		).rejects.toMatchObject({
			code: 'TOOL_COOLDOWN_ACTIVE',
		});
	});

	it('enforces timeout for slow handlers', async () => {
		const tool = specToolToAISDKTool(
			{
				name: 'timeout_tool',
				timeoutMs: 5,
			},
			async () => {
				await new Promise((resolve) => setTimeout(resolve, 20));
				return 'late';
			},
			{
				agentId: 'agent.test',
				sessionId: 'session.test',
			}
		);

		const execute = tool.execute;
		if (!execute) {
			throw new Error('Tool execute handler is missing');
		}

		await expect(
			(async () => {
				for await (const _ of execute(
					{},
					{ toolCallId: 'call-timeout', messages: [] }
				)) {
					void _;
				}
			})()
		).rejects.toMatchObject({
			code: 'TOOL_EXECUTION_TIMEOUT',
		});
	});
});
