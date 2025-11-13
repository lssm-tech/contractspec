import { Buffer } from 'node:buffer';
import type { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { describe, expect, it, vi } from 'vitest';

import {
  GcpSecretManagerProvider,
} from './gcp-secret-manager';
import {
  normalizeSecretPayload,
  parseSecretUri,
  SecretProviderError,
} from './provider';

const PROJECT_ID = 'demo-project';

describe('parseSecretUri', () => {
  it('parses provider, path, and extras', () => {
    const result = parseSecretUri(
      'gcp://projects/demo/secrets/example/versions/latest?env=prod'
    );
    expect(result).toEqual({
      provider: 'gcp',
      path: 'projects/demo/secrets/example/versions/latest',
      extras: {
        env: 'prod',
      },
    });
  });

  it('throws on invalid reference', () => {
    expect(() => parseSecretUri('invalid-ref')).toThrow(SecretProviderError);
  });
});

describe('normalizeSecretPayload', () => {
  it('converts utf-8 string to bytes', () => {
    const bytes = normalizeSecretPayload({ data: 'hello' });
    expect(Buffer.from(bytes).toString('utf-8')).toBe('hello');
  });

  it('decodes base64 payload', () => {
    const bytes = normalizeSecretPayload({
      data: Buffer.from('secret-to-store').toString('base64'),
      encoding: 'base64',
    });
    expect(Buffer.from(bytes).toString('utf-8')).toBe('secret-to-store');
  });
});

describe('GcpSecretManagerProvider', () => {
  it('can resolve secret using mocked client', async () => {
    const client = createMockClient();
    const provider = new GcpSecretManagerProvider({
      client,
      projectId: PROJECT_ID,
    });

    const reference =
      'gcp://projects/demo-project/secrets/some-secret/versions/latest';
    const result = await provider.getSecret(reference);

    expect(Buffer.from(result.data).toString('utf-8')).toBe('mock-secret');
    expect(client.accessSecretVersion).toHaveBeenCalledWith(
      {
        name: 'projects/demo-project/secrets/some-secret/versions/latest',
      },
      undefined
    );
  });

  it('creates secret when missing before adding new version', async () => {
    const client = createMockClient({ secretExists: false });
    const provider = new GcpSecretManagerProvider({
      client,
      projectId: PROJECT_ID,
    });
    const reference = 'gcp://projects/demo-project/secrets/new-secret';

    const result = await provider.setSecret(reference, {
      data: 'new-data',
    });

    expect(result.version).toBe('2');
    expect(client.createSecret).toHaveBeenCalledOnce();
    expect(client.addSecretVersion).toHaveBeenCalledWith({
      parent: 'projects/demo-project/secrets/new-secret',
      payload: { data: expect.any(Uint8Array) },
    });
  });

  it('wraps provider errors with SecretProviderError', async () => {
    const client = createMockClient({ failAccess: true });
    const provider = new GcpSecretManagerProvider({
      client,
      projectId: PROJECT_ID,
    });
    await expect(
      provider.getSecret(
        'gcp://projects/demo-project/secrets/bad-secret/versions/latest'
      )
    ).rejects.toThrow(SecretProviderError);
  });
});

interface MockClientOptions {
  secretExists?: boolean;
  failAccess?: boolean;
}

function createMockClient(options: MockClientOptions = {}) {
  const secretExists = options.secretExists ?? true;
  const failAccess = options.failAccess ?? false;

  return {
    accessSecretVersion: failAccess
      ? vi.fn(async () => {
          const error = new Error('not found');
          (error as Error & { code: number }).code = 5;
          throw error;
        })
      : vi.fn(async ({ name }: { name: string }) => [
          {
            name,
            payload: {
              data: Buffer.from('mock-secret'),
              dataCrc32c: BigInt(123),
            },
          },
        ]),
    addSecretVersion: vi.fn(async () => [
      {
        name: 'projects/demo-project/secrets/new-secret/versions/2',
      },
    ]),
    getSecret: secretExists
      ? vi.fn(async () => [undefined])
      : vi.fn(async () => {
          const error = new Error('not found');
          (error as Error & { code: number }).code = 5;
          throw error;
        }),
    createSecret: vi.fn(async () => [undefined]),
    deleteSecret: vi.fn(async () => [undefined]),
  } as unknown as SecretManagerServiceClient;
}


