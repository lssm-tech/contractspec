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

    if (!tool.execute) {
      throw new Error('Tool execute handler is missing');
    }

    await tool.execute({}, { toolCallId: 'call-1', messages: [] });

    await expect(
      tool.execute({}, { toolCallId: 'call-2', messages: [] })
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

    if (!tool.execute) {
      throw new Error('Tool execute handler is missing');
    }

    await expect(
      tool.execute({}, { toolCallId: 'call-timeout', messages: [] })
    ).rejects.toMatchObject({
      code: 'TOOL_EXECUTION_TIMEOUT',
    });
  });
});
