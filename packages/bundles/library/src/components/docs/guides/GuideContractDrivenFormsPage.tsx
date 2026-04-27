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
import { StudioPrompt } from '../shared/StudioPrompt';
import {
	formShowcaseTemplateCode,
	leadCaptureFormCode,
	leadCapturePanelCode,
} from './GuideContractDrivenFormsPage.content';

export function GuideContractDrivenFormsPage() {
	return (
		<VStack className="space-y-8">
			<VStack className="space-y-3">
				<H1 className="font-bold text-4xl">Build a contract-driven form</H1>
				<P className="text-lg text-muted-foreground">
					Define form data, fields, layout, policy, and submit behavior once,
					then let your app render from the same ContractSpec surface.
				</P>
			</VStack>

			<VStack className="card-subtle space-y-4 p-6">
				<H2 className="font-bold text-2xl">What you'll build</H2>
				<List className="space-y-2 text-muted-foreground text-sm">
					<ListItem>
						<Text>A schema-backed FormSpec for a lead capture form.</Text>
					</ListItem>
					<ListItem>
						<Text>
							A FormRegistry that exposes the latest version by stable key.
						</Text>
					</ListItem>
					<ListItem>
						<Text>
							A React renderer that keeps UI, validation, and policy aligned.
						</Text>
					</ListItem>
				</List>
			</VStack>

			<VStack className="space-y-6">
				<VStack className="space-y-3">
					<H2 className="font-bold text-2xl">1) Define the form spec</H2>
					<P className="text-muted-foreground text-sm">
						Create <Code>src/contracts/forms/lead-capture.form.ts</Code>:
					</P>
					<CodeBlock
						language="typescript"
						filename="src/contracts/forms/lead-capture.form.ts"
						code={leadCaptureFormCode}
					/>
				</VStack>

				<VStack className="card-subtle space-y-3 p-6">
					<H3 className="font-semibold text-lg">Need every form field?</H3>
					<P className="text-muted-foreground text-sm">
						Start from the{' '}
						<Link href="/docs/examples/form-showcase">
							Form Showcase example
						</Link>{' '}
						or the{' '}
						<Link href="/templates?tag=forms">form template catalog</Link>. It
						is focused only on forms and covers field kinds, section layouts,
						step layouts, arrays, groups, conditionals, and validation hints.
					</P>
					<CodeBlock
						language="bash"
						filename="form-showcase-template"
						code={formShowcaseTemplateCode}
					/>
				</VStack>

				<VStack className="space-y-3">
					<H2 className="font-bold text-2xl">2) Render from the contract</H2>
					<P className="text-muted-foreground text-sm">
						Use the shared renderer, or provide your own driver if your app uses
						a different component library.
					</P>
					<CodeBlock
						language="tsx"
						filename="src/components/LeadCapturePanel.tsx"
						code={leadCapturePanelCode}
					/>
				</VStack>

				<VStack className="space-y-3">
					<H2 className="font-bold text-2xl">3) Validate and evolve</H2>
					<CodeBlock
						language="bash"
						filename="validate-form"
						code={`contractspec validate src/contracts/forms/lead-capture.form.ts`}
					/>
					<P className="text-muted-foreground text-sm">
						Expected output: <Code>Validation passed</Code>. When the form
						becomes public contract surface, version changes deliberately
						instead of editing field meaning in place.
					</P>
				</VStack>

				<VStack className="card-subtle space-y-3 p-6">
					<H3 className="font-semibold text-lg">Repo tutorial</H3>
					<P className="text-muted-foreground text-sm">
						The repository guide adds the longer implementation checklist,
						custom renderer notes, and rollout rules.
					</P>
					<CodeBlock
						language="bash"
						filename="repo-guide"
						code={`open docs/tutorials/contract-driven-forms.md`}
					/>
				</VStack>

				<StudioPrompt
					title="Need governed form changes?"
					body="Studio can connect form edits to customer evidence, approval packets, and rollout checks before teams regenerate public surfaces."
				/>
			</VStack>

			<HStack className="flex items-center gap-4 pt-4">
				<Link
					href="/docs/guides/generate-docs-clients-schemas"
					className="btn-primary"
				>
					<Text>Next: Generate docs + clients</Text>
					<ChevronRight size={16} />
				</Link>
				<Link href="/docs/guides" className="btn-ghost">
					<Text>Back to guides</Text>
				</Link>
			</HStack>
		</VStack>
	);
}
