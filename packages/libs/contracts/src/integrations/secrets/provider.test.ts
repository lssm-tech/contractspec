import { Buffer } from 'node:buffer';
import type { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { GcpSecretManagerProvider } from './gcp-secret-manager';
import { EnvSecretProvider } from './env-secret-provider';
import {
  normalizeSecretPayload,
  parseSecretUri,
  SecretProviderError,
} from './provider';
import type { SecretProvider } from './provider';
import { SecretProviderManager } from './manager';

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
      {}
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

describe('EnvSecretProvider', () => {
  const provider = new EnvSecretProvider();

  afterEach(() => {
    delete process.env.LOCAL_SECRET;
    delete process.env.PROJECTS_DEMO_SECRETS_STRIPE_SECRET_KEY_VERSIONS_LATEST;
    delete process.env.STRIPE_SECRET_KEY_OVERRIDE;
  });

  it('handles env scheme references', async () => {
    process.env.LOCAL_SECRET = 'super-secret';
    expect(provider.canHandle('env://LOCAL_SECRET')).toBe(true);

    const secret = await provider.getSecret('env://LOCAL_SECRET');
    expect(Buffer.from(secret.data).toString('utf-8')).toBe('super-secret');
    expect(secret.version).toBe('current');
  });

  it('derives env key from non-env references', async () => {
    process.env.PROJECTS_DEMO_SECRETS_STRIPE_SECRET_KEY_VERSIONS_LATEST =
      'override';
    const reference =
      'gcp://projects/demo/secrets/stripe-secret-key/versions/latest';
    expect(provider.canHandle(reference)).toBe(true);

    const secret = await provider.getSecret(reference);
    expect(Buffer.from(secret.data).toString('utf-8')).toBe('override');
  });

  it('supports explicit env alias through extras', async () => {
    process.env.STRIPE_SECRET_KEY_OVERRIDE = 'alias-value';
    const reference =
      'gcp://projects/demo/secrets/stripe?env=STRIPE_SECRET_KEY_OVERRIDE';

    const secret = await provider.getSecret(reference);
    expect(Buffer.from(secret.data).toString('utf-8')).toBe('alias-value');
  });

  it('throws NOT_FOUND when variable missing', async () => {
    await expect(provider.getSecret('env://UNKNOWN')).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
  });

  it('is read-only for write operations', async () => {
    await expect(
      provider.setSecret('env://LOCAL_SECRET', { data: 'value' })
    ).rejects.toMatchObject({
      code: 'FORBIDDEN',
    });

    await expect(
      provider.rotateSecret('env://LOCAL_SECRET', { data: 'value' })
    ).rejects.toMatchObject({
      code: 'FORBIDDEN',
    });

    await expect(
      provider.deleteSecret('env://LOCAL_SECRET')
    ).rejects.toMatchObject({
      code: 'FORBIDDEN',
    });
  });
});

describe('SecretProviderManager', () => {
  afterEach(() => {
    delete process.env.MANAGER_LOCAL_SECRET;
  });

  it('prefers higher priority provider', async () => {
    process.env.MANAGER_LOCAL_SECRET = 'manager-secret';
    const envProvider = new EnvSecretProvider();
    const fallbackProvider = createStaticProvider({
      id: 'fallback',
      scheme: 'gcp',
      secretText: 'fallback-secret',
    });

    const manager = new SecretProviderManager();
    manager.register(envProvider, { priority: 10 });
    manager.register(fallbackProvider, { priority: 1 });

    const secret = await manager.getSecret('env://MANAGER_LOCAL_SECRET');
    expect(Buffer.from(secret.data).toString('utf-8')).toBe('manager-secret');
    expect(fallbackProvider.getSecret).not.toHaveBeenCalled();
  });

  it('falls back when privileged provider is unavailable', async () => {
    const envProvider = new EnvSecretProvider();
    const fallbackProvider = createStaticProvider({
      id: 'gcp',
      scheme: 'gcp',
      secretText: 'gcp-secret',
    });

    const manager = new SecretProviderManager();
    manager.register(envProvider, { priority: 10 });
    manager.register(fallbackProvider, { priority: 1 });

    const reference =
      'gcp://projects/demo/secrets/stripe-secret-key/versions/latest';
    const secret = await manager.getSecret(reference);

    expect(Buffer.from(secret.data).toString('utf-8')).toBe('gcp-secret');
  });

  it('delegates write operations to capable provider', async () => {
    const envProvider = new EnvSecretProvider();
    const fallbackProvider = createStaticProvider({
      id: 'gcp',
      scheme: 'gcp',
      secretText: 'gcp-secret',
    });

    const manager = new SecretProviderManager();
    manager.register(envProvider, { priority: 10 });
    manager.register(fallbackProvider, { priority: 1 });

    const reference =
      'gcp://projects/demo/secrets/stripe-secret-key/versions/latest';

    await manager.setSecret(reference, { data: 'value' });
    expect(fallbackProvider.setSecret).toHaveBeenCalledWith(reference, {
      data: 'value',
    });
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

function createStaticProvider(params: {
  id: string;
  scheme: string;
  secretText: string;
}) {
  const { id, scheme, secretText } = params;
  const encoded = Buffer.from(secretText, 'utf-8');

  return {
    id,
    canHandle(reference: string) {
      return reference.startsWith(`${scheme}://`);
    },
    getSecret: vi.fn(async () => ({
      data: encoded,
      version: 'latest',
      retrievedAt: new Date(),
    })),
    setSecret: vi.fn(async (_reference: string, _payload: unknown) => ({
      reference: `${scheme}://static`,
      version: 'latest',
    })),
    rotateSecret: vi.fn(async () => ({
      reference: `${scheme}://static`,
      version: 'latest',
    })),
    deleteSecret: vi.fn(async () => undefined),
  } as unknown as SecretProvider & {
    getSecret: ReturnType<typeof vi.fn>;
    setSecret: ReturnType<typeof vi.fn>;
  };
}
