/**
 * MCP prompt templates for the agentpacks registry.
 *
 * Prompts generate structured messages that help AI assistants
 * recommend or compare packs from the registry.
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getDb } from '../db/client';
import { SearchService } from '../services/search-service';
import { PackService } from '../services/pack-service';

export function registerPrompts(server: McpServer): void {
  server.prompt(
    'suggest_packs',
    "Suggest relevant agentpacks based on a user's development context and needs.",
    {
      useCase: z
        .string()
        .describe(
          "What the user is trying to accomplish (e.g. 'set up TypeScript linting rules')"
        ),
      targets: z
        .string()
        .optional()
        .describe(
          "Comma-separated target IDs the user works with (e.g. 'cursor,opencode')"
        ),
      maxSuggestions: z
        .string()
        .optional()
        .describe('Maximum number of suggestions (default 5)'),
    },
    async ({ useCase, targets, maxSuggestions }) => {
      const db = getDb();
      const search = new SearchService(db);
      const limit = maxSuggestions ? Number(maxSuggestions) : 5;
      const targetList = targets
        ?.split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const result = await search.search({
        q: useCase,
        targets: targetList,
        limit,
      });

      const packList =
        result.packs.length === 0
          ? 'No packs found matching this use case.'
          : result.packs
              .map(
                (p, i) =>
                  `${i + 1}. **${p.name}** — ${p.description}\n` +
                  `   Targets: ${(p.targets as string[]).join(', ') || 'all'} | ` +
                  `Downloads: ${p.downloads}`
              )
              .join('\n\n');

      return {
        messages: [
          {
            role: 'user' as const,
            content: {
              type: 'text' as const,
              text: [
                `I need help finding agentpacks for: ${useCase}`,
                targets ? `I use these AI coding tools: ${targets}` : '',
                '',
                'Here are the relevant packs from the registry:',
                '',
                packList,
                '',
                'Please recommend which packs would be most useful for my use case,',
                'explain why each is relevant, and show how to install them.',
              ]
                .filter(Boolean)
                .join('\n'),
            },
          },
        ],
      };
    }
  );

  server.prompt(
    'compare_packs',
    'Compare two or more agentpacks side-by-side to help choose the best option.',
    {
      packNames: z
        .string()
        .describe(
          "Comma-separated pack names to compare (e.g. 'typescript-strict,eslint-pro')"
        ),
    },
    async ({ packNames }) => {
      const db = getDb();
      const packService = new PackService(db);
      const names = packNames
        .split(',')
        .map((n) => n.trim())
        .filter(Boolean);

      const packs = await Promise.all(
        names.map(async (name) => {
          const pack = await packService.get(name);
          return { name, pack };
        })
      );

      const found = packs.flatMap((p) => (p.pack ? [p.pack] : []));
      const notFound = packs.filter((p) => p.pack === null).map((p) => p.name);

      const comparison = found
        .map((pk) => {
          return [
            `## ${pk.displayName} (\`${pk.name}\`)`,
            '',
            pk.description,
            '',
            `| Property | Value |`,
            `|----------|-------|`,
            `| Author | ${pk.authorName} |`,
            `| License | ${pk.license} |`,
            `| Downloads | ${pk.downloads} (${pk.weeklyDownloads}/week) |`,
            `| Tags | ${(pk.tags as string[]).join(', ') || 'none'} |`,
            `| Targets | ${(pk.targets as string[]).join(', ') || 'all'} |`,
            `| Features | ${(pk.features as string[]).join(', ') || 'none'} |`,
            `| Verified | ${pk.verified ? 'Yes' : 'No'} |`,
          ].join('\n');
        })
        .join('\n\n---\n\n');

      const notFoundNote =
        notFound.length > 0
          ? `\n\n> **Not found**: ${notFound.join(', ')}`
          : '';

      return {
        messages: [
          {
            role: 'user' as const,
            content: {
              type: 'text' as const,
              text: [
                `Please compare these agentpacks and help me choose the best one:`,
                '',
                comparison,
                notFoundNote,
                '',
                'Based on this comparison, which pack would you recommend and why?',
                'Consider features, popularity, target support, and maintenance.',
              ]
                .filter(Boolean)
                .join('\n'),
            },
          },
        ],
      };
    }
  );
}
