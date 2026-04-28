import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';
import { Box, HStack, VStack } from '@contractspec/lib.design-system/layout';
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
	refactorPrompt,
	scratchPrompt,
	shellParts,
	shellUsageExample,
} from './LibrariesApplicationShellPage.content';

export function LibrariesApplicationShellPage() {
	return (
		<VStack className="space-y-8">
			<VStack className="space-y-4">
				<H1 className="font-bold text-4xl">Application shell</H1>
				<P className="text-lg text-muted-foreground">
					A reusable navigation system for product apps: desktop sidebar, topbar
					breadcrumbs, command search, account actions, mobile adapters, and a
					Notion-style <Code>PageOutline</Code> for page sections.
				</P>
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">Installation</H2>
				<InstallCommand package="@contractspec/lib.design-system" />
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">What It Standardizes</H2>
				<Box className="grid gap-4 md:grid-cols-2">
					{shellParts.map((part) => (
						<Box key={part.title} className="card-subtle p-4">
							<H3 className="font-semibold">{part.title}</H3>
							<P className="mt-2 text-muted-foreground text-sm leading-7">
								{part.body}
							</P>
						</Box>
					))}
				</Box>
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">Import Surface</H2>
				<P className="text-muted-foreground">
					The shell is exposed as a focused design-system subpath so apps can
					adopt navigation chrome without pulling unrelated documentation or
					marketing helpers.
				</P>
				<CodeBlock
					language="tsx"
					filename="app-shell-example.tsx"
					code={shellUsageExample}
				/>
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">AI Prompt: Build From Scratch</H2>
				<P className="text-muted-foreground">
					Use this prompt when the app does not already have a shell or when the
					design-system package needs the reusable primitive first.
				</P>
				<CodeBlock
					language="markdown"
					filename="implement-application-shell.md"
					code={scratchPrompt}
				/>
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">AI Prompt: Refactor An App</H2>
				<P className="text-muted-foreground">
					Use this prompt when an app already has custom navigation chrome and
					needs to migrate without breaking route behavior.
				</P>
				<CodeBlock
					language="markdown"
					filename="refactor-to-application-shell.md"
					code={refactorPrompt}
				/>
			</VStack>

			<VStack className="card-subtle space-y-3 p-6">
				<H2 className="font-bold text-2xl">Naming</H2>
				<P className="text-muted-foreground">
					Use <Code>AppShell</Code> for the whole navigation frame and{' '}
					<Code>PageOutline</Code> for the in-page navigation helper. The latter
					is the product-app equivalent of a table of contents, but it is
					intentionally named for live page sections rather than static
					documentation.
				</P>
			</VStack>

			<HStack className="flex flex-wrap items-center gap-3 pt-2">
				<Link href="/docs/libraries/cross-platform-ui" className="btn-ghost">
					<Text>Cross-platform UI</Text>
				</Link>
				<Link href="/docs/libraries/design-system" className="btn-primary">
					<Text>Design System</Text> <ChevronRight size={16} />
				</Link>
			</HStack>
		</VStack>
	);
}
