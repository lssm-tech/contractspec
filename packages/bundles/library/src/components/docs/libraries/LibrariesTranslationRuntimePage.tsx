import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';
import { HStack, VStack } from '@contractspec/lib.design-system/layout';
import { List, ListItem } from '@contractspec/lib.design-system/list';
import {
	Code,
	H1,
	H2,
	H3,
	P,
	Text,
} from '@contractspec/lib.design-system/typography';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';
import {
	i18nextAdapterExample,
	ssrHydrationExample,
	translationRuntimeChecks,
	translationRuntimeExample,
	translationRuntimeInstall,
	translationRuntimeLayers,
	translationRuntimePrompt,
} from './LibrariesTranslationRuntimePage.content';

export function LibrariesTranslationRuntimePage() {
	return (
		<VStack className="space-y-8">
			<VStack className="space-y-4">
				<Text className="editorial-kicker">Runtime and adapters</Text>
				<H1 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
					Translation runtime and i18next adapter
				</H1>
				<P className="max-w-3xl text-lg text-muted-foreground leading-8">
					Use ContractSpec as the canonical translation contract layer, then
					resolve and format messages through a framework-independent runtime.
					i18next is supported as an optional downstream adapter, not as the
					source of truth.
				</P>
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">Install the runtime</H2>
				<InstallCommand package={translationRuntimeInstall} />
				<P className="text-muted-foreground">
					<Text>Add </Text>
					<Code>i18next</Code>
					<Text>
						{' '}
						only when an app imports the adapter subpath. Core server, React,
						React Native, CLI, and test code can use the runtime without loading
						i18next.
					</Text>
				</P>
			</VStack>

			<HStack className="grid gap-4 md:grid-cols-3">
				{translationRuntimeLayers.map((item) => (
					<VStack className="card-subtle space-y-2 p-5" key={item.title}>
						<H3 className="font-semibold text-lg">{item.title}</H3>
						<P className="text-muted-foreground text-sm leading-7">
							{item.body}
						</P>
					</VStack>
				))}
			</HStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">Use the ContractSpec runtime</H2>
				<P className="text-muted-foreground">
					<Text>The runtime consumes canonical </Text>
					<Code>TranslationSpec[]</Code>
					<Text>
						{' '}
						catalogs, supports BCP 47 tags such as en-US, ar-EG, and zh-Hans,
						and delegates ICU parsing/formatting to a mature formatter engine
						instead of a custom parser.
					</Text>
				</P>
				<CodeBlock language="typescript" code={translationRuntimeExample} />
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">Project to i18next when needed</H2>
				<P className="text-muted-foreground">
					<Text>Import from </Text>
					<Code>@contractspec/lib.translation-runtime/i18next</Code>
					<Text>
						{' '}
						to export resources by locale, namespace, and message key. The
						namespace defaults to the stable bundle key, dotted message keys
						stay flat with keySeparator false, and metadata remains in a sidecar
						manifest.
					</Text>
				</P>
				<CodeBlock language="typescript" code={i18nextAdapterExample} />
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">SSR, streaming, and hydration</H2>
				<P className="text-muted-foreground">
					Negotiate locale on the server, preload catalogs needed for streamed
					content, and hydrate the client from the same serialized state. Never
					let client-only language detection choose a different locale after the
					server has rendered.
				</P>
				<CodeBlock language="typescript" code={ssrHydrationExample} />
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">Production checklist</H2>
				<List className="list-disc space-y-2 pl-6 text-muted-foreground">
					{translationRuntimeChecks.map((item) => (
						<ListItem key={item}>{item}</ListItem>
					))}
				</List>
			</VStack>

			<VStack className="space-y-4 rounded-xl border border-border p-6">
				<H2 className="font-bold text-2xl">Agent implementation prompt</H2>
				<P className="text-muted-foreground">
					Use this prompt when asking an agent to wire translations into a web,
					server, or React Native surface without losing ContractSpec ownership.
				</P>
				<CodeBlock language="markdown" code={translationRuntimePrompt} />
			</VStack>

			<HStack className="flex flex-wrap items-center gap-4 pt-4">
				<Link href="/docs/libraries/contracts" className="btn-ghost">
					<Text>Translation contracts</Text>
				</Link>
				<Link href="/docs/libraries/design-system" className="btn-primary">
					<Text>Design-system integration</Text>
					<ChevronRight size={16} />
				</Link>
			</HStack>
		</VStack>
	);
}
