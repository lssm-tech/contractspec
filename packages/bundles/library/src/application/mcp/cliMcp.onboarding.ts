import { createNodeAdapters, onboarding } from '@contractspec/bundle.workspace';
import {
	defineCommand,
	definePrompt,
	defineResourceTemplate,
	installOp,
	type OperationSpecRegistry,
	type PromptRegistry,
	type ResourceRegistry,
} from '@contractspec/lib.contracts-spec';
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import z from 'zod';

const ONBOARDING_TAGS = ['cli', 'mcp', 'onboarding'];
const ONBOARDING_OWNERS = ['@contractspec'];

function parseTrackIds(tracks: string | undefined) {
	return tracks
		?.split(',')
		.map((track) => track.trim())
		.filter(Boolean) as onboarding.OnboardingTrackId[] | undefined;
}

async function buildPlan(args: { tracks?: string; example?: string } = {}) {
	const adapters = createNodeAdapters({
		cwd: process.cwd(),
		silent: true,
	});
	return onboarding.buildOnboardingPlan(adapters, {
		forcedExampleKey: args.example,
		selectedTracks: parseTrackIds(args.tracks),
	});
}

export function registerCliOnboardingResources(resources: ResourceRegistry) {
	resources.register(
		defineResourceTemplate({
			meta: {
				uriTemplate: 'onboarding://tracks',
				title: 'Onboarding tracks',
				description:
					'Primary ContractSpec onboarding tracks exposed by the CLI.',
				mimeType: 'application/json',
				tags: ONBOARDING_TAGS,
			},
			input: z.object({}),
			resolve: async () => ({
				uri: 'onboarding://tracks',
				mimeType: 'application/json',
				data: JSON.stringify(onboarding.listOnboardingTracks(), null, 2),
			}),
		})
	);

	resources.register(
		defineResourceTemplate({
			meta: {
				uriTemplate: 'onboarding://track/{id}',
				title: 'Onboarding track',
				description:
					'Track-specific onboarding metadata and recommended commands.',
				mimeType: 'application/json',
				tags: ONBOARDING_TAGS,
			},
			input: z.object({ id: z.string() }),
			resolve: async ({ id }) => ({
				uri: `onboarding://track/${id}`,
				mimeType: 'application/json',
				data: JSON.stringify(
					onboarding.getOnboardingTrack(id) ?? null,
					null,
					2
				),
			}),
		})
	);

	resources.register(
		defineResourceTemplate({
			meta: {
				uriTemplate: 'onboarding://artifacts/{id}{?tracks,example}',
				title: 'Rendered onboarding artifact',
				description:
					'Render AGENTS.md or USAGE.md content for the current repo.',
				mimeType: 'text/markdown',
				tags: ONBOARDING_TAGS,
			},
			input: z.object({
				example: z.string().optional(),
				id: z.enum(['agent-guide', 'human-guide']),
				tracks: z.string().optional(),
			}),
			resolve: async ({ example, id, tracks }) => {
				const plan = await buildPlan({ example, tracks });
				return {
					uri: `onboarding://artifacts/${id}`,
					mimeType: 'text/markdown',
					data:
						id === 'agent-guide'
							? plan.guides.agentGuide
							: plan.guides.humanGuide,
				};
			},
		})
	);
}

export function registerCliOnboardingPrompts(prompts: PromptRegistry) {
	prompts.register(
		definePrompt({
			meta: {
				key: 'cli.onboarding',
				version: '1.0.0',
				title: 'Plan a ContractSpec onboarding flow',
				description:
					'Suggest the right onboarding track and artifacts for a repo.',
				tags: ONBOARDING_TAGS,
				stability: 'beta',
				owners: ONBOARDING_OWNERS,
			},
			args: [
				{
					name: 'goal',
					description: 'Repository onboarding goal or focus area.',
					required: false,
					schema: z.string().optional(),
				},
			],
			input: z.object({ goal: z.string().optional() }),
			render: async ({ goal }) => [
				{
					type: 'text',
					text: `Use onboarding://tracks and onboarding_suggestTracks-v1_0_0 before recommending repo-local ContractSpec adoption steps.${goal ? ` Goal: ${goal}.` : ''}`,
				},
				{
					type: 'resource' as const,
					uri: 'onboarding://tracks',
					title: 'Tracks',
				},
			],
		})
	);
}

export function registerCliOnboardingOps(registry: OperationSpecRegistry) {
	const SuggestTracksInput = defineSchemaModel({
		name: 'OnboardingSuggestTracksInput',
		fields: {
			example: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
			tracks: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		},
	});
	const SuggestTracksOutput = defineSchemaModel({
		name: 'OnboardingSuggestTracksOutput',
		fields: {
			nextCommands: {
				type: ScalarTypeEnum.String_unsecure(),
				isArray: true,
				isOptional: false,
			},
			primaryTrack: {
				type: ScalarTypeEnum.String_unsecure(),
				isOptional: false,
			},
			reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
			tracks: {
				type: ScalarTypeEnum.String_unsecure(),
				isArray: true,
				isOptional: false,
			},
		},
	});
	const RenderArtifactsOutput = defineSchemaModel({
		name: 'OnboardingRenderArtifactOutput',
		fields: {
			content: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
			primaryTrack: {
				type: ScalarTypeEnum.String_unsecure(),
				isOptional: false,
			},
		},
	});
	const NextCommandOutput = defineSchemaModel({
		name: 'OnboardingNextCommandOutput',
		fields: {
			nextCommand: {
				type: ScalarTypeEnum.String_unsecure(),
				isOptional: false,
			},
			primaryTrack: {
				type: ScalarTypeEnum.String_unsecure(),
				isOptional: false,
			},
		},
	});

	installOp(
		registry,
		defineCommand({
			meta: {
				key: 'onboarding.suggestTracks',
				version: '1.0.0',
				stability: 'stable',
				owners: ONBOARDING_OWNERS,
				tags: ONBOARDING_TAGS,
				description: 'Suggest the recommended ContractSpec onboarding tracks.',
				goal: 'Help agents choose the right onboarding track before editing repo-local guides.',
				context: 'Used inside the CLI MCP server.',
			},
			io: { input: SuggestTracksInput, output: SuggestTracksOutput },
			policy: { auth: 'anonymous' },
		}),
		async ({ example, tracks }) => {
			const plan = await buildPlan({ example, tracks });
			return {
				nextCommands: plan.nextCommands,
				primaryTrack: plan.primaryTrack.id,
				reason: plan.recommendations[0]?.reason ?? plan.primaryTrack.summary,
				tracks: plan.recommendations.map(
					(recommendation) => recommendation.track.id
				),
			};
		}
	);

	installOp(
		registry,
		defineCommand({
			meta: {
				key: 'onboarding.renderArtifacts',
				version: '1.0.0',
				stability: 'stable',
				owners: ONBOARDING_OWNERS,
				tags: ONBOARDING_TAGS,
				description: 'Render onboarding artifacts for the current repo.',
				goal: 'Provide AGENTS.md or USAGE.md content without mutating the repo.',
				context: 'Used inside the CLI MCP server.',
			},
			io: {
				input: defineSchemaModel({
					name: 'OnboardingRenderArtifactInput',
					fields: {
						artifact: {
							type: ScalarTypeEnum.String_unsecure(),
							isOptional: false,
						},
						example: {
							type: ScalarTypeEnum.String_unsecure(),
							isOptional: true,
						},
						tracks: {
							type: ScalarTypeEnum.String_unsecure(),
							isOptional: true,
						},
					},
				}),
				output: RenderArtifactsOutput,
			},
			policy: { auth: 'anonymous' },
		}),
		async ({ artifact, example, tracks }) => {
			const plan = await buildPlan({ example, tracks });
			return {
				content:
					artifact === 'agent-guide'
						? plan.guides.agentGuide
						: plan.guides.humanGuide,
				primaryTrack: plan.primaryTrack.id,
			};
		}
	);

	installOp(
		registry,
		defineCommand({
			meta: {
				key: 'onboarding.nextCommand',
				version: '1.0.0',
				stability: 'stable',
				owners: ONBOARDING_OWNERS,
				tags: ONBOARDING_TAGS,
				description: 'Return the next recommended CLI command for onboarding.',
				goal: 'Help agents choose the next onboarding command without mutating the repo.',
				context: 'Used inside the CLI MCP server.',
			},
			io: { input: SuggestTracksInput, output: NextCommandOutput },
			policy: { auth: 'anonymous' },
		}),
		async ({ example, tracks }) => {
			const plan = await buildPlan({ example, tracks });
			return {
				nextCommand: plan.nextCommands[0] ?? 'contractspec onboard',
				primaryTrack: plan.primaryTrack.id,
			};
		}
	);
}
