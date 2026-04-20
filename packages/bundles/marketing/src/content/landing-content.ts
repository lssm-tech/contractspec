import type { LandingCta, LandingStoryContent } from './landing-content.types';

export const CONTRACTSPEC_SITE_BASE_URL = 'https://www.contractspec.io';

export const contractspecLandingStory: LandingStoryContent = {
	hero: {
		badge: {
			label: 'Open system, explicit control',
			iconKey: 'shield-check',
		},
		kicker: 'ContractSpec for AI-native teams',
		title: 'Build and run AI-native systems on explicit contracts.',
		subtitle:
			'ContractSpec gives teams an open spec system for defining behavior, aligning every surface, and regenerating safely. The OSS foundation stays yours. Studio is the operating layer when you want a product on top.',
		ctas: [
			{
				id: 'start-oss',
				label: 'Start with OSS',
				href: '/install',
				kind: 'internal',
				variant: 'primary',
			},
			{
				id: 'explore-studio',
				label: 'Explore Studio',
				href: 'https://www.contractspec.studio',
				kind: 'external',
				variant: 'ghost',
			},
			{
				id: 'see-architecture',
				label: 'See the architecture',
				href: '/product',
				kind: 'internal',
				variant: 'ghost',
			},
		],
		proofStats: [
			{ value: '1', label: 'explicit system source' },
			{ value: '4+', label: 'aligned surface families' },
			{ value: '0', label: 'required lock-in' },
		],
	},
	clarityPanel: {
		kicker: 'What the site should make clear',
		title: 'This is not yet another AI builder.',
		description:
			'ContractSpec exists for teams that already know AI can write a lot of software, but need explicit control over what that software is allowed to become over time.',
		points: [
			'Keep the code and the standards you already use.',
			'Stabilize one module at a time instead of rewriting your app.',
			'Move into Studio only when you want the operating product.',
		],
	},
	failureModes: {
		kicker: 'Why teams end up here',
		title: 'AI speed is not the problem. Implicit systems are.',
		description:
			'Once a team depends on prompts, AI edits, and generated code across multiple surfaces, the real failure mode is not AI wrote bad code. It is that nobody can state the system rules precisely enough to keep regeneration safe.',
		items: [
			{
				title: 'Implicit rules drift first',
				description:
					'Prompt chains and AI edits move faster than the product rules they are supposed to respect.',
			},
			{
				title: 'Surfaces stop agreeing',
				description:
					'API, UI, database, events, and MCP tools evolve independently unless something explicit keeps them aligned.',
			},
			{
				title: 'Teams lose safe regeneration',
				description:
					'Without a stable contract layer, every regeneration feels like rewriting production in the dark.',
			},
		],
	},
	systemSurfaces: {
		kicker: 'The open system',
		title: 'One explicit layer that keeps the whole stack honest.',
		description:
			'ContractSpec is broader than generation. It is the contract layer, the runtime bridges, the proof surfaces, and the adoption path that lets teams move from OSS control to an operating product without pretending they are different systems.',
		items: [
			{
				title: 'Contracts and generation',
				description:
					'Define the canonical behavior once and derive the implementation surfaces from it.',
				iconKey: 'braces',
			},
			{
				title: 'Runtime adapters',
				description:
					'Bind the same source of truth to REST, GraphQL, React, MCP, and operational flows.',
				iconKey: 'workflow',
			},
			{
				title: 'Harness and proof',
				description:
					'Replay, evaluate, inspect, and verify how the system behaves before you trust automation with more.',
				iconKey: 'chart-column',
			},
			{
				title: 'Studio operating layer',
				description:
					'Run the opinionated product loop when you want coordination, governance, and a packaged operating surface.',
				iconKey: 'sparkles',
			},
		],
	},
	outputs: {
		kicker: 'What the OSS layer actually gives you',
		title: 'Explicit contracts show up where teams usually lose control.',
		description:
			'The promise is not magic generation. The promise is that the same product rules can shape APIs, data, interfaces, and agent tools without each surface inventing its own truth.',
		items: [
			{
				title: 'APIs',
				description:
					'Typed endpoints and schemas stay aligned with the same contract language the team edits.',
				iconKey: 'git-branch',
			},
			{
				title: 'Data',
				description:
					'Schema, validation, and migrations are shaped by the same product rules instead of scattered implementations.',
				iconKey: 'database',
			},
			{
				title: 'Interfaces',
				description:
					'Forms, presentations, and client types inherit the same system boundaries instead of drifting from the backend.',
				iconKey: 'blocks',
			},
			{
				title: 'Agents and tools',
				description:
					'MCP tools and agent-facing surfaces are generated from explicit contracts rather than guessed from code.',
				iconKey: 'bot',
			},
		],
	},
	adoptionPath: {
		kicker: 'Adoption path',
		title:
			'Start where the risk is highest, not where the marketing says to start.',
		steps: [
			'Start with one module that is already drifting or feels unsafe to regenerate.',
			'Define explicit contracts, then bring API, UI, data, and tools back into alignment.',
			'Adopt Studio when the team wants an operating surface on top of the open system.',
		],
	},
	studio: {
		kicker: 'Studio on top',
		title: 'Studio is the operating surface, not a replacement identity.',
		description:
			'Use Studio when your team wants a packaged loop for evidence, drafting, review, export, and follow-up. The relationship should feel like the best application built on top of the same open system, not a bait-and-switch away from it.',
		summaries: [
			{
				label: 'OSS/Core',
				description:
					'contracts, generation, runtimes, harnesses, agent tooling.',
			},
			{
				label: 'Studio',
				description:
					'the opinionated operating loop when a team wants the product.',
			},
		],
	},
	finalCta: {
		kicker: 'Choose your path',
		title:
			'Adopt the open system first. Evaluate Studio when the team is ready for the operating layer.',
		description:
			'That is the product story the site should tell everywhere: open foundation, explicit contracts, safe regeneration, then an opinionated surface on top for teams that want it.',
		ctas: [
			{
				id: 'final-start-oss',
				label: 'Start with OSS',
				href: '/install',
				kind: 'internal',
				variant: 'primary',
			},
			{
				id: 'final-explore-studio',
				label: 'Explore Studio',
				href: 'https://www.contractspec.studio',
				kind: 'external',
				variant: 'ghost',
			},
			{
				id: 'see-packaging',
				label: 'See packaging',
				href: '/pricing',
				kind: 'internal',
				variant: 'ghost',
			},
		],
	},
};

export function resolveContractspecLandingCtaUrl(cta: LandingCta): string {
	if (cta.kind === 'external') return cta.href;
	return new URL(cta.href, CONTRACTSPEC_SITE_BASE_URL).toString();
}

export function findContractspecLandingCta(id: string): LandingCta | null {
	const ctas = [
		...contractspecLandingStory.hero.ctas,
		...contractspecLandingStory.finalCta.ctas,
	];
	return ctas.find((cta) => cta.id === id) ?? null;
}
