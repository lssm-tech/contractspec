import { DEFAULT_CONTRACTSRC } from '@contractspec/lib.contracts/workspace-config';
import { mergeConfig, type Config } from './config';

describe('mergeConfig', () => {
  it('maps opencode alias to opencode-sdk', () => {
    const merged = mergeConfig(
      { ...DEFAULT_CONTRACTSRC },
      {
        agentMode: 'opencode',
      }
    );

    expect(merged.agentMode).toBe('opencode-sdk');
  });

  it('normalizes opencode in config defaults', () => {
    const config = {
      ...DEFAULT_CONTRACTSRC,
      agentMode: 'opencode',
    } as unknown as Config;

    const merged = mergeConfig(config, {});

    expect(merged.agentMode).toBe('opencode-sdk');
  });
});
