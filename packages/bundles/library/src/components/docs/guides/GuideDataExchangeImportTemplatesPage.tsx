import { CodeBlock } from '@contractspec/lib.design-system';
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
	accountImportTemplateCode,
	clientReviewCode,
	developerPrompt,
	partnerPrompt,
	serverDryRunCode,
	verificationCode,
} from './GuideDataExchangeImportTemplatesPage.content';

const mappingRules = [
	'Explicit mappings win first, so existing integrations can keep their current mapping arrays.',
	'Template resolution checks exact headers, aliases, normalized labels, and SchemaModel fallback inference.',
	'Format profiles can override formats by target field or template column key without changing the template.',
	'Required template columns become visible preview issues when no source column can be matched.',
];

const formatKinds = [
	'text trim and case normalization',
	'localized numbers with decimal and thousands separators',
	'custom true/false boolean labels',
	'dates and datetimes with accepted input formats',
	'JSON parsing, empty-as-null, and default values',
	'split/join delimiters, currency symbols, and percentages',
];

export function GuideDataExchangeImportTemplatesPage() {
	return (
		<VStack className="space-y-8">
			<VStack className="space-y-3">
				<Text className="editorial-kicker">Build</Text>
				<H1 className="font-bold text-4xl">
					Import flexible files with data-exchange templates
				</H1>
				<P className="max-w-3xl text-lg text-muted-foreground leading-8">
					Publish one recommended import shape, then let users import
					CSV/JSON/XML files with partner-specific headers, skipped rows,
					localized values, and alternate metadata layouts.
				</P>
			</VStack>

			<VStack className="card-subtle space-y-4 p-6">
				<H2 className="font-bold text-2xl">What you&apos;ll build</H2>
				<List className="space-y-2 text-muted-foreground text-sm">
					<ListItem>
						<Text>
							A canonical template with target fields, aliases, and formats.
						</Text>
					</ListItem>
					<ListItem>
						<Text>
							A dry-run import that reports confidence, gaps, and ignored
							columns.
						</Text>
					</ListItem>
					<ListItem>
						<Text>
							A client review state where users remap, update formats, or accept
							inferred mappings.
						</Text>
					</ListItem>
				</List>
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">1) Define the template</H2>
				<P className="text-muted-foreground text-sm leading-7">
					Use <Code>defineDataExchangeTemplate</Code> for neutral import/export
					naming. <Code>defineImportTemplate</Code> and{' '}
					<Code>defineExportTemplate</Code> remain available aliases.
				</P>
				<CodeBlock
					language="typescript"
					filename="src/data-exchange/accounts-import.ts"
					code={accountImportTemplateCode}
				/>
			</VStack>

			<VStack className="grid gap-4 md:grid-cols-2">
				<VStack className="card-subtle space-y-3 p-6">
					<H3 className="font-bold text-xl">Mapping precedence</H3>
					<List className="space-y-2 text-muted-foreground text-sm">
						{mappingRules.map((rule) => (
							<ListItem key={rule}>
								<Text>{rule}</Text>
							</ListItem>
						))}
					</List>
				</VStack>
				<VStack className="card-subtle space-y-3 p-6">
					<H3 className="font-bold text-xl">Supported value formats</H3>
					<List className="space-y-2 text-muted-foreground text-sm">
						{formatKinds.map((format) => (
							<ListItem key={format}>
								<Text>{format}</Text>
							</ListItem>
						))}
					</List>
				</VStack>
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">
					2) Dry-run partner CSV, JSON, or XML files on the server
				</H2>
				<P className="text-muted-foreground text-sm leading-7">
					File, HTTP, and storage adapters accept codec options. CSV can set
					delimiters, quotes, skipped rows, header rows, or explicit columns.
					JSON can read records and metadata from custom keys. XML can use
					custom root, record, metadata, and attribute fields.
				</P>
				<CodeBlock
					language="typescript"
					filename="src/server/import-accounts.ts"
					code={serverDryRunCode}
				/>
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">3) Let users review the mapping</H2>
				<P className="text-muted-foreground text-sm leading-7">
					The shared controller exposes template rows, matched source columns,
					confidence, required status, formatting summaries, unmatched required
					rows, and ignored source columns. Actions let users remap columns,
					select aliases, update field formats, reset to the template, or accept
					inferred mappings.
				</P>
				<CodeBlock
					language="tsx"
					filename="src/components/ImportMappingReview.tsx"
					code={clientReviewCode}
				/>
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">4) Verify the package stack</H2>
				<CodeBlock
					language="bash"
					filename="verification"
					code={verificationCode}
				/>
			</VStack>

			<VStack className="grid gap-4 md:grid-cols-2">
				<VStack className="card-subtle space-y-3 p-6">
					<H3 className="font-bold text-xl">Prompt: build a template</H3>
					<CodeBlock
						language="markdown"
						filename="template-authoring.prompt.md"
						code={developerPrompt}
					/>
				</VStack>
				<VStack className="card-subtle space-y-3 p-6">
					<H3 className="font-bold text-xl">Prompt: inspect a partner file</H3>
					<CodeBlock
						language="markdown"
						filename="partner-import-review.prompt.md"
						code={partnerPrompt}
					/>
				</VStack>
			</VStack>

			<HStack className="flex flex-wrap items-center gap-4 pt-4">
				<Link href="/llms/lib.data-exchange-core" className="btn-primary">
					<Text>Core package guide</Text>
					<ChevronRight size={16} />
				</Link>
				<Link href="/llms/lib.data-exchange-server" className="btn-ghost">
					<Text>Server package guide</Text>
				</Link>
			</HStack>
		</VStack>
	);
}
