import { definePrompt, PromptRegistry } from '@contractspec/lib.contracts-spec';
import type { DocPresentationRoute } from '@contractspec/lib.contracts-spec/docs';
import z from 'zod';
import { searchDocs } from './docsMcp.data';
import { resolveContractReference } from './docsMcp.reference';

const DOC_OWNERS = ['@contractspec'];
const DOC_TAGS = ['docs', 'mcp'];

export function buildDocPrompts(routes: DocPresentationRoute[]) {
	const prompts = new PromptRegistry();

	prompts.register(
		definePrompt({
			meta: {
				key: 'docs.navigator',
				version: '1.0.0',
				title: 'Find relevant ContractSpec docs',
				description:
					'Guide agents to search, filter, and open the right ContractSpec docs.',
				tags: DOC_TAGS,
				stability: 'beta',
				owners: DOC_OWNERS,
			},
			args: [
				{
					name: 'topic',
					description: 'Goal or subject to search for.',
					required: false,
					schema: z.string().optional(),
				},
				{
					name: 'kind',
					description: 'Optional doc kind filter.',
					required: false,
					schema: z.string().optional(),
				},
				{
					name: 'tag',
					description: 'Optional tag filter.',
					required: false,
					schema: z.string().optional(),
				},
			],
			input: z.object({
				topic: z.string().optional(),
				kind: z.string().optional(),
				tag: z.string().optional(),
			}),
			render: async ({ topic, kind, tag }) => {
				const matches = searchDocs(routes, {
					query: topic,
					kind,
					tag,
					limit: 3,
				});
				const suggestedDocs = matches.docs.length
					? matches.docs
							.map((doc) => `- ${doc.title} (${doc.id}) -> ${doc.route}`)
							.join('\n')
					: '- No direct pre-match. Use docs_list_facets-v1_0_0 to browse tags and kinds.';

				return [
					{
						type: 'text' as const,
						text: [
							'Use docs_search-v1_0_0 first, then read docs://doc/{id} for the strongest matches.',
							'Use docs_resolve_route-v1_0_0 when the user already gives you a docs URL or route.',
							'Use docs_list_facets-v1_0_0 or docs://facets to browse the docs taxonomy before guessing.',
							topic ? `Topic: ${topic}` : '',
							kind ? `Kind: ${kind}` : '',
							tag ? `Tag: ${tag}` : '',
							'Suggested starting docs:',
							suggestedDocs,
						]
							.filter(Boolean)
							.join('\n'),
					},
					{
						type: 'resource' as const,
						uri: 'docs://index',
						title: 'DocBlocks index',
					},
					{
						type: 'resource' as const,
						uri: 'docs://facets',
						title: 'Docs facets',
					},
				];
			},
		})
	);

	prompts.register(
		definePrompt({
			meta: {
				key: 'docs.reference.guide',
				version: '1.0.0',
				title: 'Resolve a ContractSpec reference',
				description:
					'Guide agents to fetch the canonical reference payload for a ContractSpec surface.',
				tags: DOC_TAGS,
				stability: 'beta',
				owners: DOC_OWNERS,
			},
			args: [
				{
					name: 'key',
					description: 'ContractSpec key to resolve.',
					required: true,
					schema: z.string(),
				},
				{
					name: 'version',
					description: 'Optional version override.',
					required: false,
					schema: z.string().optional(),
				},
				{
					name: 'type',
					description:
						'Optional surface type: command, query, form, data-view, presentation, event.',
					required: false,
					schema: z.string().optional(),
				},
			],
			input: z.object({
				key: z.string(),
				version: z.string().optional(),
				type: z.string().optional(),
			}),
			render: async ({ key, version, type }) => {
				const reference = resolveContractReference({
					key,
					version,
					type,
					includeSchema: true,
				}).reference;

				return [
					{
						type: 'text' as const,
						text: [
							'Use docs_contract_reference-v1_0_0 when you need the canonical docs payload for a ContractSpec surface.',
							'Use docs_get-v1_0_0 only when you already know the exact DocBlock id and need raw markdown.',
							`Resolved key: ${reference.key}`,
							`Resolved type: ${reference.type}`,
							reference.route ? `Docs route: ${reference.route}` : '',
							`Resource URI: docs://contract-reference/${encodeURIComponent(key)}`,
						]
							.filter(Boolean)
							.join('\n'),
					},
					{
						type: 'resource' as const,
						uri: `docs://contract-reference/${encodeURIComponent(key)}`,
						title: 'Contract reference',
					},
				];
			},
		})
	);

	return prompts;
}
