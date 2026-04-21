import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';
import {
	aliasSetupCards,
	customerChecklistMarkdown,
	customerPolicyMarkdown,
	designSystemHelperCards,
	designSystemHelperExample,
	gotchas,
	hookCards,
	layerCards,
	layoutRules,
	markdownKitIntro,
	metroAliasExample,
	remapCards,
	renderingExample,
	stackExample,
	turbopackAliasExample,
	webpackAliasExample,
} from './LibrariesCrossPlatformUIPage.content';

export function LibrariesCrossPlatformUIPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="font-bold text-4xl">Cross-platform UI</h1>
				<p className="text-lg text-muted-foreground">
					How ContractSpec keeps React and React Native components compatible by
					splitting responsibility across shared runtime models, platform
					primitives, resolver aliases, and the composed design-system layer.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">What cross-platform means here</h2>
				<p className="text-muted-foreground">
					The shared rendering story is layered: the core package owns models
					and resolver helpers, the React packages own hook APIs, the UI kits
					own raw primitives, and the design-system owns the higher-level
					product surfaces that pair web and mobile implementations.
				</p>
				<div className="grid gap-4 md:grid-cols-2">
					{layerCards.map((card) => (
						<div
							key={card.title}
							className="rounded-[20px] border border-border/70 p-4"
						>
							<h3 className="font-semibold text-base">{card.title}</h3>
							<p className="mt-2 text-muted-foreground text-sm leading-7">
								{card.body}
							</p>
						</div>
					))}
				</div>

				<div className="grid gap-4 md:grid-cols-3">
					{hookCards.map((card) => (
						<div key={card.title} className="card-subtle p-4">
							<h3 className="font-semibold">{card.title}</h3>
							<p className="mt-2 text-muted-foreground text-sm leading-7">
								{card.body}
							</p>
						</div>
					))}
				</div>

				<div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
					<div className="grid gap-4 md:grid-cols-2">
						{designSystemHelperCards.map((card) => (
							<div key={card.title} className="card-subtle p-4">
								<h3 className="font-semibold">{card.title}</h3>
								<p className="mt-2 text-muted-foreground text-sm leading-7">
									{card.body}
								</p>
							</div>
						))}
					</div>
					<CodeBlock
						language="typescript"
						filename="design-system-platform.ts"
						code={designSystemHelperExample}
					/>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Resolver and alias setup</h2>
				<p className="text-muted-foreground">
					Teach the bundler what “web” and “native” mean before you try to share
					component code. These helpers are public from the root
					<code> @contractspec/lib.presentation-runtime-core </code>
					entrypoint.
				</p>
				<div className="grid gap-4 md:grid-cols-2">
					{aliasSetupCards.map((card) => (
						<div key={card.title} className="card-subtle p-4">
							<h3 className="font-semibold">{card.title}</h3>
							<p className="mt-2 text-muted-foreground text-sm leading-7">
								{card.body}
							</p>
						</div>
					))}
				</div>
				<div className="grid gap-4 xl:grid-cols-3">
					<CodeBlock
						language="typescript"
						filename="next.config.mjs"
						code={turbopackAliasExample}
					/>
					<CodeBlock
						language="typescript"
						filename="next.config.mjs"
						code={webpackAliasExample}
					/>
					<CodeBlock
						language="javascript"
						filename="metro.config.js"
						code={metroAliasExample}
					/>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">How the remapping works</h2>
				<p className="text-muted-foreground">
					The helpers are intentionally asymmetric because Turbopack patches the
					Next config object, Webpack mutates a resolver config, and Metro maps
					modules at request time for native platforms.
				</p>
				<div className="grid gap-4 xl:grid-cols-3">
					{remapCards.map((card) => (
						<div key={card.title} className="card-subtle p-4">
							<h3 className="font-semibold">{card.title}</h3>
							<ul className="mt-2 space-y-2 text-muted-foreground text-sm leading-7">
								{card.items.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Layout primitives</h2>
				<p className="text-muted-foreground">
					<code>VStack</code>, <code>HStack</code>, and <code>Box</code> are the
					closest thing to a shared layout vocabulary, but their defaults and a
					few props still differ across the web and native packages.
				</p>
				<div className="grid gap-4 md:grid-cols-2">
					{layoutRules.map((rule) => (
						<div
							key={rule}
							className="card-subtle p-4 text-muted-foreground text-sm leading-7"
						>
							{rule}
						</div>
					))}
				</div>
				<CodeBlock
					language="tsx"
					filename="stack-layout.tsx"
					code={stackExample}
				/>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Rendering patterns</h2>
				<p className="text-muted-foreground">
					Keep the controller stable, then decide whether the final surface
					should be a raw web primitive, a raw native primitive, or a composed
					design-system wrapper.
				</p>
				<CodeBlock
					language="tsx"
					filename="cross-platform-rendering.tsx"
					code={renderingExample}
				/>
				<div className="card-subtle p-4 text-muted-foreground text-sm leading-7">
					For higher-level shared rendering, use the design-system surfaces that
					already ship paired implementations such as{' '}
					<code>DataViewRenderer</code>, <code>ListTablePage</code>, and{' '}
					<code>DataTable</code>. The web and mobile files stay separate inside
					the package while your app imports one design-system boundary.
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Gotchas and boundaries</h2>
				<ul className="space-y-2 text-muted-foreground leading-7">
					{gotchas.map((item) => (
						<li key={item}>{item}</li>
					))}
				</ul>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Customer markdown kit</h2>
				<p className="text-muted-foreground">{markdownKitIntro}</p>
				<div className="grid gap-4 xl:grid-cols-2">
					<CodeBlock
						language="markdown"
						filename="cross-surface-policy.md"
						code={customerPolicyMarkdown}
					/>
					<CodeBlock
						language="markdown"
						filename="cross-surface-checklist.md"
						code={customerChecklistMarkdown}
					/>
				</div>
			</div>

			<div className="flex flex-wrap items-center gap-3 pt-2">
				<Link href="/docs/libraries/runtime" className="btn-ghost">
					Runtime libraries
				</Link>
				<Link href="/docs/libraries/ui-kit" className="btn-ghost">
					UI Kit
				</Link>
				<Link href="/docs/libraries/ui-kit-web" className="btn-ghost">
					UI Kit Web
				</Link>
				<Link href="/docs/libraries/design-system" className="btn-primary">
					Design System <ChevronRight size={16} />
				</Link>
			</div>
		</div>
	);
}
