/**
 * MCP resource registrations for the pack registry.
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getDb } from '../db/client.js';
import { PackService } from '../services/pack-service.js';
import { SearchService } from '../services/search-service.js';

/**
 * Register all registry resources on the MCP server.
 */
export function registerResources(server: McpServer): void {
  // All packs (paginated list)
  server.resource(
    'registry-packs',
    'registry://packs',
    {
      description: 'List of all packs in the agentpacks registry',
      mimeType: 'application/json',
    },
    async () => {
      const db = getDb();
      const packService = new PackService(db);
      const { packs, total } = await packService.list({
        limit: 100,
        sort: 'downloads',
      });

      return {
        contents: [
          {
            uri: 'registry://packs',
            mimeType: 'application/json',
            text: JSON.stringify(
              {
                total,
                packs: packs.map((p) => ({
                  name: p.name,
                  displayName: p.displayName,
                  description: p.description,
                  author: p.authorName,
                  downloads: p.downloads,
                  tags: p.tags,
                  targets: p.targets,
                  features: p.features,
                })),
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Single pack detail (dynamic)
  server.resource(
    'registry-pack-detail',
    'registry://packs/{name}',
    {
      description: 'Detailed information about a specific pack',
      mimeType: 'application/json',
    },
    async (uri) => {
      const name = uri.pathname.split('/').pop() ?? '';
      const db = getDb();
      const packService = new PackService(db);
      const pack = await packService.get(name);

      if (!pack) {
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: 'application/json',
              text: JSON.stringify({ error: `Pack "${name}" not found` }),
            },
          ],
        };
      }

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(pack, null, 2),
          },
        ],
      };
    }
  );

  // Featured packs
  server.resource(
    'registry-featured',
    'registry://featured',
    {
      description: 'Featured/curated packs from the registry',
      mimeType: 'application/json',
    },
    async () => {
      const db = getDb();
      const packService = new PackService(db);
      const featured = await packService.featured(10);

      return {
        contents: [
          {
            uri: 'registry://featured',
            mimeType: 'application/json',
            text: JSON.stringify(
              {
                packs: featured.map((p) => ({
                  name: p.name,
                  displayName: p.displayName,
                  description: p.description,
                  downloads: p.downloads,
                  verified: p.verified,
                })),
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Tags with counts
  server.resource(
    'registry-tags',
    'registry://tags',
    {
      description: 'All tags used in the registry with their pack counts',
      mimeType: 'application/json',
    },
    async () => {
      const db = getDb();
      const search = new SearchService(db);
      const tags = await search.getTags();

      return {
        contents: [
          {
            uri: 'registry://tags',
            mimeType: 'application/json',
            text: JSON.stringify({ tags }, null, 2),
          },
        ],
      };
    }
  );
}
