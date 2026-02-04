import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { alpicAssetPath, alpicAssetUrl } from '../assets/paths';
import { registerAlpicResources } from './resources';
import { registerAlpicTools } from './tools';

type ToolHandler = (args: { message?: string }) => Promise<{
  content: { type: string; text: string }[];
}>;

type ResourceHandler = () => Promise<{
  contents: { uri: string; mimeType?: string; text?: string }[];
}>;

interface ToolRegistration {
  name: string;
  description?: string;
  handler: ToolHandler;
}

interface ResourceRegistration {
  name: string;
  uri: string;
  title: string;
  description?: string;
  mimeType?: string;
  handler: ResourceHandler;
}

class StubMcpServer {
  public tools: ToolRegistration[] = [];
  public resources: ResourceRegistration[] = [];

  registerTool(
    name: string,
    meta: { description?: string; inputSchema: unknown },
    handler: ToolHandler
  ): void {
    this.tools.push({
      name,
      description: meta.description,
      handler,
    });
  }

  registerResource(
    name: string,
    uri: string,
    meta: { title: string; description?: string; mimeType?: string },
    handler: ResourceHandler
  ): void {
    this.resources.push({
      name,
      uri,
      title: meta.title,
      description: meta.description,
      mimeType: meta.mimeType,
      handler,
    });
  }
}

describe('alpic asset helpers', () => {
  const originalHost = process.env.ALPIC_HOST;

  beforeEach(() => {
    process.env.ALPIC_HOST = originalHost;
  });

  afterEach(() => {
    process.env.ALPIC_HOST = originalHost;
  });

  it('normalizes asset paths', () => {
    expect(alpicAssetPath('')).toBe('/assets');
    expect(alpicAssetPath('index.html')).toBe('/assets/index.html');
    expect(alpicAssetPath('/logo.png')).toBe('/assets/logo.png');
    expect(alpicAssetPath('/assets/icon.svg')).toBe('/assets/icon.svg');
  });

  it('builds asset URLs when ALPIC_HOST is set', () => {
    process.env.ALPIC_HOST = 'demo.alpic.live';
    expect(alpicAssetUrl('index.html')).toBe(
      'https://demo.alpic.live/assets/index.html'
    );
  });

  it('returns relative paths when ALPIC_HOST is missing', () => {
    delete process.env.ALPIC_HOST;
    expect(alpicAssetUrl('index.html')).toBe('/assets/index.html');
  });
});

describe('alpic MCP registration', () => {
  const originalHost = process.env.ALPIC_HOST;

  beforeEach(() => {
    process.env.ALPIC_HOST = originalHost;
  });

  afterEach(() => {
    process.env.ALPIC_HOST = originalHost;
  });

  it('registers ping tool and returns payload', async () => {
    const server = new StubMcpServer();
    registerAlpicTools(server as unknown as McpServer);

    expect(server.tools).toHaveLength(1);
    expect(server.tools[0].name).toBe('alpic.ping');

    const result = await server.tools[0].handler({ message: 'hello' });
    const payload = JSON.parse(result.content[0].text) as {
      ok: boolean;
      message: string;
      assetsBase: string;
    };

    expect(payload.ok).toBe(true);
    expect(payload.message).toBe('hello');
    expect(payload.assetsBase).toBe('/assets');
  });

  it('registers UI resource with asset URLs', async () => {
    process.env.ALPIC_HOST = 'demo.alpic.live';
    const server = new StubMcpServer();
    registerAlpicResources(server as unknown as McpServer);

    expect(server.resources).toHaveLength(1);
    expect(server.resources[0].uri).toBe('app://ui');

    const result = await server.resources[0].handler();
    const payload = JSON.parse(result.contents[0].text ?? '') as {
      path: string;
      url: string;
    };

    expect(payload.path).toBe('/assets/index.html');
    expect(payload.url).toBe('https://demo.alpic.live/assets/index.html');
  });
});
