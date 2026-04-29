import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

const libraryGroups = [
	{
		title: 'Contract and schema foundation',
		body: 'Use these packages to define explicit contracts, schemas, and generated artifacts without inventing a new platform-specific language.',
		items: [
			{
				title: '@contractspec/lib.contracts-spec',
				description:
					'Define operations, events, policies, and generated surfaces in TypeScript.',
				href: '/docs/libraries/contracts',
			},
			{
				title: '@contractspec/lib.schema',
				description:
					'Share type-safe schema definitions across validation, clients, and runtime adapters.',
				href: '/docs/libraries/schema',
			},
		],
	},
	{
		title: 'Runtime and surface libraries',
		body: 'These packages execute the contract model across UI, data, observability, workflows, and generated runtime behavior.',
		items: [
			{
				title: '@contractspec/lib.runtime',
				description:
					'Run typed capability surfaces, execute policies, and connect runtime adapters.',
				href: '/docs/libraries/runtime',
			},
			{
				title: '@contractspec/lib.translation-runtime',
				description:
					'Resolve ContractSpec TranslationSpec catalogs with ICU formatting, SSR snapshots, BCP 47 locales, overrides, and optional i18next projection.',
				href: '/docs/libraries/translation-runtime',
			},
			{
				title: '@contractspec/lib.ui-kit',
				description:
					'Render shared surfaces across web and React Native without forking the contract layer.',
				href: '/docs/libraries/ui-kit',
			},
			{
				title: '@contractspec/lib.ui-kit-web',
				description:
					'Use the raw web primitive layer directly when you want the browser table, accessibility, and interaction model without the design-system shell.',
				href: '/docs/libraries/ui-kit-web',
			},
			{
				title: '@contractspec/lib.design-system',
				description:
					'Build higher-level product surfaces, actionable object references, adaptive panels, and documented marketing/docs primitives on top of the web and native UI packages.',
				href: '/docs/libraries/design-system',
			},
			{
				title: 'Application shell',
				description:
					'Adopt the shared sidebar, topbar, command search, notifications, mobile navigation, and PageOutline patterns for product apps.',
				href: '/docs/libraries/application-shell',
			},
			{
				title: 'Cross-platform UI',
				description:
					'See how the presentation runtimes, ui-kit-web, ui-kit, and design-system stay compatible across React and React Native.',
				href: '/docs/libraries/cross-platform-ui',
			},
			{
				title: '@contractspec/lib.data-views',
				description:
					'Generate and render list/detail style surfaces that stay aligned with data contracts.',
				href: '/docs/libraries/data-views',
			},
		],
	},
	{
		title: 'Operator and system packages',
		body: 'These packages matter once the system is live and you need governance, resilience, and observability.',
		items: [
			{
				title: '@contractspec/lib.observability',
				description:
					'Trace, log, and measure contract execution using the same system boundaries.',
				href: '/docs/libraries/observability',
			},
			{
				title: '@contractspec/lib.resilience',
				description:
					'Add circuit breakers, retries, and failure controls without hiding the integration model.',
				href: '/docs/libraries/resilience',
			},
			{
				title: '@contractspec/lib.multi-tenancy',
				description:
					'Keep tenant-specific config, policy, and surface resolution explicit.',
				href: '/docs/libraries/multi-tenancy',
			},
			{
				title: '@contractspec/lib.workflow-composer',
				description:
					'Compose and extend workflows without smearing orchestration concerns across apps.',
				href: '/docs/libraries/workflow-composer',
			},
		],
	},
];

export function LibrariesOverviewPage() {
	return (
		<div className="space-y-10">
			<div className="space-y-3">
				<p className="editorial-kicker">Build</p>
				<h1 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
					The OSS foundation is a library system, not a closed platform.
				</h1>
				<p className="max-w-3xl text-lg text-muted-foreground leading-8">
					ContractSpec is assembled from libraries that remain useful on their
					own and stronger together. Start with the contract and schema
					foundation, then add runtime, UI, integration, and operator packages
					as your system grows.
				</p>
			</div>

			<div className="editorial-proof-strip">
				<div className="editorial-stat">
					<span className="editorial-label">Layering rule</span>
					<span className="editorial-stat-value">libs → bundles → apps</span>
				</div>
				<p className="max-w-2xl text-muted-foreground text-sm leading-7">
					Keep reusable behavior in libraries, compose it into bundle-level
					surfaces, and reserve app packages for concrete delivery shells.
				</p>
			</div>

			<div className="space-y-6">
				{libraryGroups.map((group) => (
					<section key={group.title} className="editorial-panel space-y-5">
						<div className="space-y-2">
							<h2 className="font-serif text-3xl tracking-[-0.03em]">
								{group.title}
							</h2>
							<p className="text-muted-foreground text-sm leading-7">
								{group.body}
							</p>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							{group.items.map((item) => (
								<Link
									key={item.title}
									href={item.href}
									className="rounded-[24px] border border-border/75 bg-background/70 p-5 transition-colors hover:border-[color:rgb(162_79_42_/_0.45)]"
								>
									<h3 className="font-semibold text-lg">{item.title}</h3>
									<p className="mt-2 text-muted-foreground text-sm leading-7">
										{item.description}
									</p>
									<div className="mt-3 flex items-center gap-2 text-[color:var(--rust)] text-sm">
										Learn more <ChevronRight size={14} />
									</div>
								</Link>
							))}
						</div>
					</section>
				))}
			</div>
		</div>
	);
}
