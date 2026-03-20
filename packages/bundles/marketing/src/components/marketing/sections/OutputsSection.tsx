import { IconGridSection } from './IconGridSection';

const outputs = [
	{
		title: 'REST API',
		description:
			'Type-safe endpoints with validation. Standard Express/Hono/Elysia handlers.',
		icon: '🔌',
	},
	{
		title: 'GraphQL Schema',
		description:
			'Automatically generated resolvers. Standard Pothos/Apollo output.',
		icon: '📊',
	},
	{
		title: 'Database Schema',
		description: 'Prisma migrations and types. Standard SQL underneath.',
		icon: '🗄️',
	},
	{
		title: 'MCP Tools',
		description:
			'AI agent tool definitions. Works with Claude, GPT, and any MCP client.',
		icon: '🤖',
	},
	{
		title: 'Client SDKs',
		description: 'Type-safe API clients. Standard fetch/axios underneath.',
		icon: '📦',
	},
	{
		title: 'UI Components',
		description: 'React forms and views from specs. Standard JSX output.',
		icon: '🎨',
	},
];

export function OutputsSection() {
	return (
		<IconGridSection
			tone="muted"
			columns={3}
			title="What ContractSpec generates"
			subtitle="One contract, multiple outputs. All in sync. All standard tech."
			iconRole="iconFirst"
			items={outputs.map((item) => ({
				icon: () => (
					<span aria-hidden className="text-3xl">
						{item.icon}
					</span>
				),
				title: item.title,
				description: item.description,
			}))}
		/>
	);
}
