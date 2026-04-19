'use client';

import { ExampleCatalogDataView } from '@contractspec/lib.contracts-spec/docs';
import {
	ButtonLink,
	DataViewList,
	StatusChip,
} from '@contractspec/lib.design-system';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { H1, Muted } from '@contractspec/lib.ui-kit-web/ui/typography';
import {
	buildExampleDocsHref,
	listPublicExamples,
} from '@contractspec/module.examples';

interface ExampleItem extends Record<string, unknown> {
	id: string;
	title: string;
	summary?: string;
	route: string;
	tags?: string[];
	sandboxEnabled: boolean;
}

export function DocsExamplesPage() {
	const items: ExampleItem[] = listPublicExamples()
		.map((example) => {
			const title = example.meta.title ?? example.meta.key;
			return {
				id: example.meta.key,
				title,
				summary: example.meta.summary ?? example.meta.description,
				route: buildExampleDocsHref(example.meta.key),
				tags: example.meta.tags,
				sandboxEnabled: example.surfaces.sandbox.enabled,
			};
		})
		.sort((a, b) => a.title.localeCompare(b.title));

	const listSpec = {
		...ExampleCatalogDataView,
		view: {
			...ExampleCatalogDataView.view,
			kind: 'list' as const,
		},
	};

	return (
		<VStack gap="xl">
			<VStack gap="sm">
				<H1>Examples</H1>
				<Muted>
					Reference implementations for real ContractSpec surfaces. Use them to
					study adoption patterns, inspect generated artifacts, and validate the
					OSS workflow against runnable systems.
				</Muted>
			</VStack>

			<DataViewList
				spec={listSpec}
				items={items}
				emptyState={<Muted>No examples available.</Muted>}
				renderActions={(example) => {
					return (
						<HStack gap="xs" justify="end">
							{example.sandboxEnabled ? (
								<ButtonLink
									href={`/sandbox?template=${example.id}`}
									size="sm"
									variant="outline"
								>
									Sandbox
								</ButtonLink>
							) : null}
							<ButtonLink href={example.route} size="sm">
								Reference
							</ButtonLink>
							{example.tags?.[0] ? (
								<StatusChip size="sm" label={example.tags[0]} />
							) : null}
						</HStack>
					);
				}}
			/>
		</VStack>
	);
}
