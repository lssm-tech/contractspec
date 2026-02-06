import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { alpicAssetPath, alpicAssetUrl } from '../assets/paths';

export interface AlpicMcpUiConfig {
  resourceKey?: string;
  resourceUri?: string;
  title?: string;
  description?: string;
  assetPath?: string;
}

const defaultResourceKey = 'alpic_ui';
const defaultResourceUri = 'app://ui';

export function registerAlpicResources(
  server: McpServer,
  config: AlpicMcpUiConfig = {}
): void {
  const assetPath = config.assetPath ?? 'index.html';
  const path = alpicAssetPath(assetPath);
  const url = alpicAssetUrl(assetPath);
  const resourceKey = config.resourceKey ?? defaultResourceKey;
  const resourceUri = config.resourceUri ?? defaultResourceUri;
  const title = config.title ?? 'ChatGPT App UI';
  const description =
    config.description ?? 'Entry point for the ChatGPT App UI hosted on Alpic.';

  server.registerResource(
    resourceKey,
    resourceUri,
    {
      title,
      description,
      mimeType: 'application/json',
    },
    async () => {
      const payload = {
        title,
        description,
        path,
        url,
      };

      return {
        contents: [
          {
            uri: resourceUri,
            mimeType: 'application/json',
            text: JSON.stringify(payload, null, 2),
          },
        ],
      };
    }
  );
}
