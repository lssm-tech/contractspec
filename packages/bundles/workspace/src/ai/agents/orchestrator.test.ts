import { AgentOrchestrator } from './orchestrator';
import type { Config } from '../../types/config';

describe('AgentOrchestrator', () => {
  it('falls back from opencode-sdk to claude-code', () => {
    const config: Config = {
      aiProvider: 'claude',
      agentMode: 'opencode-sdk',
      outputDir: './src',
      conventions: {
        operations: 'operations',
        events: 'events',
        presentations: 'presentations',
        forms: 'forms',
      },
      defaultOwners: [],
      defaultTags: [],
    };

    const orchestrator = new AgentOrchestrator(config);
    const fallback = (
      orchestrator as unknown as {
        getFallbackMode: (mode: Config['agentMode']) => Config['agentMode'];
      }
    ).getFallbackMode('opencode-sdk');

    expect(fallback).toBe('claude-code');
  });
});
