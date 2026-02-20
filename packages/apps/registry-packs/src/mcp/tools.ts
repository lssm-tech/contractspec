/**
 * MCP tool registrations for the pack registry.
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getDb } from '../db/client.js';
import { PackService } from '../services/pack-service.js';
import { SearchService } from '../services/search-service.js';
import { VersionService } from '../services/version-service.js';

/**
 * Register all registry tools on the MCP server.
 */
export function registerTools(server: McpServer): void {
  server.tool(
    'search_packs',
    'Search the agentpacks registry for packs matching a query. Returns name, description, downloads, and supported targets.',
    {
      query: z.string().describe('Search query text'),
      tags: z.array(z.string()).optional().describe('Filter by tags'),
      targets: z
        .array(z.string())
        .optional()
        .describe('Filter by target IDs (e.g. opencode, cursor)'),
      limit: z
        .number()
        .min(1)
        .max(50)
        .optional()
        .describe('Max results (default 20)'),
    },
    async ({ query, tags, targets, limit }) => {
      const db = getDb();
      const search = new SearchService(db);
      const result = await search.search({
        q: query,
        tags,
        targets,
        limit: limit ?? 20,
      });

      const text =
        result.packs.length === 0
          ? `No packs found for "${query}".`
          : result.packs
              .map(
                (p) =>
                  `**${p.name}** — ${p.description}\n  Downloads: ${p.downloads} | Targets: ${(p.targets as string[]).join(', ')}`
              )
              .join('\n\n');

      return {
        content: [
          {
            type: 'text' as const,
            text: `Found ${result.total} packs:\n\n${text}`,
          },
        ],
      };
    }
  );

  server.tool(
    'get_pack_info',
    'Get detailed information about a specific pack including its latest version, features, and metadata.',
    {
      name: z.string().describe('Pack name'),
    },
    async ({ name }) => {
      const db = getDb();
      const packService = new PackService(db);
      const versionService = new VersionService(db);

      const pack = await packService.get(name);
      if (!pack) {
        return {
          content: [
            { type: 'text' as const, text: `Pack "${name}" not found.` },
          ],
        };
      }

      const latest = await versionService.getLatest(name);
      const info = [
        `# ${pack.displayName}`,
        '',
        pack.description,
        '',
        `- **Author**: ${pack.authorName}`,
        `- **License**: ${pack.license}`,
        `- **Downloads**: ${pack.downloads} (${pack.weeklyDownloads}/week)`,
        `- **Tags**: ${(pack.tags as string[]).join(', ') || 'none'}`,
        `- **Targets**: ${(pack.targets as string[]).join(', ') || 'all'}`,
        `- **Features**: ${(pack.features as string[]).join(', ') || 'none'}`,
        `- **Latest**: ${latest?.version ?? 'no versions'}`,
        '',
        '## Install',
        '',
        '```jsonc',
        `{ "packs": ["registry:${pack.name}"] }`,
        '```',
      ].join('\n');

      return { content: [{ type: 'text' as const, text: info }] };
    }
  );

  server.tool(
    'list_featured',
    'List featured/curated packs from the registry.',
    {
      limit: z
        .number()
        .min(1)
        .max(20)
        .optional()
        .describe('Max results (default 10)'),
    },
    async ({ limit }) => {
      const db = getDb();
      const packService = new PackService(db);
      const featured = await packService.featured(limit ?? 10);

      if (featured.length === 0) {
        return {
          content: [
            { type: 'text' as const, text: 'No featured packs available.' },
          ],
        };
      }

      const text = featured
        .map(
          (p) => `- **${p.name}**: ${p.description} (${p.downloads} downloads)`
        )
        .join('\n');

      return {
        content: [
          { type: 'text' as const, text: `## Featured Packs\n\n${text}` },
        ],
      };
    }
  );

  server.tool(
    'list_by_target',
    'List packs that support a specific AI coding tool target.',
    {
      targetId: z
        .string()
        .describe('Target ID (e.g. opencode, cursor, claudecode, copilot)'),
      limit: z
        .number()
        .min(1)
        .max(50)
        .optional()
        .describe('Max results (default 20)'),
    },
    async ({ targetId, limit }) => {
      const db = getDb();
      const search = new SearchService(db);
      const packs = await search.getByTarget(targetId, limit ?? 20);

      if (packs.length === 0) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `No packs found for target "${targetId}".`,
            },
          ],
        };
      }

      const text = packs
        .map(
          (p) => `- **${p.name}**: ${p.description} (${p.downloads} downloads)`
        )
        .join('\n');

      return {
        content: [
          {
            type: 'text' as const,
            text: `## Packs for ${targetId}\n\n${text}`,
          },
        ],
      };
    }
  );

  server.tool(
    'get_pack_readme',
    'Get the full README content for a pack.',
    {
      name: z.string().describe('Pack name'),
    },
    async ({ name }) => {
      const db = getDb();
      const packService = new PackService(db);
      const readme = await packService.getReadme(name);

      if (!readme) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `No README found for pack "${name}".`,
            },
          ],
        };
      }

      return { content: [{ type: 'text' as const, text: readme }] };
    }
  );
}
