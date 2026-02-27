import { DEFAULT_CONTRACTSRC } from '@contractspec/lib.contracts-spec/workspace-config';
import { getApiKey, mergeConfig, type Config } from './config';

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

describe('getApiKey', () => {
  it('returns Mistral API key for mistral provider', () => {
    const previous = process.env.MISTRAL_API_KEY;
    process.env.MISTRAL_API_KEY = 'test-mistral-key';

    const apiKey = getApiKey('mistral');

    expect(apiKey).toBe('test-mistral-key');
    if (previous === undefined) {
      delete process.env.MISTRAL_API_KEY;
      return;
    }
    process.env.MISTRAL_API_KEY = previous;
  });
});
